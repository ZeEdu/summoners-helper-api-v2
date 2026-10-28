import { DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { toObservable } from '@angular/core/rxjs-interop';
import { FieldTree } from "@angular/forms/signals";
import { MatPaginator } from "@angular/material/paginator";
import { DEFAULT_LIMIT, IPopulatedReportDto, REPORT_REASON, ReportPaginationDto } from "@org/contracts";
import { catchError, debounceTime, map, merge, Observable, of, startWith, Subject, switchMap, tap } from "rxjs";
import { GuideReportService } from "./guide-report.service";

export type GuideReportTableItem = IPopulatedReportDto

type TableForm = FieldTree<{ observation: string, reason: REPORT_REASON | null }>

enum FILTER_EVENTS {
  PAGINATION = 'pagination',
  FILTER = 'filter',
  RELOAD = 'reload'
}

export class GuideReportTableDataSource extends DataSource<GuideReportTableItem> {
  paginator: MatPaginator | undefined;
  database: GuideReportService | undefined;
  form: TableForm;

  resultsLength = signal(0)
  isLoading = signal(true)
  hasError = signal(false)

  observationField$;
  reason$;

  testData: IPopulatedReportDto[] = []

  private _reload = new Subject<void>()

  private get reload$() {
    return this._reload.asObservable()
  }

  constructor(form: TableForm) {
    super()

    this.form = form;

    this.observationField$ = toObservable(this.form.observation().value)
    this.reason$ = toObservable(this.form.reason().value)
  }

  reloadTable() {
    this._reload.next()
  }

  override connect(): Observable<GuideReportTableItem[]> {
    if (!this.paginator || !this.database) {
      throw Error(
        'Please set the paginator, and database on the data source before connecting.'
      );
    }

    const paginationEvent$ = this.paginator.page
      .pipe(
        map(() => ({ type: FILTER_EVENTS.PAGINATION }))
      )

    const filterEvents$ = merge(this.observationField$, this.reason$)
      .pipe(
        debounceTime(250),
        map(() => ({ type: FILTER_EVENTS.FILTER }))
      )

    const reloadEvent$ = this.reload$
      .pipe(
        map(() => ({ type: FILTER_EVENTS.RELOAD }))
      )

    return merge(
      paginationEvent$,
      filterEvents$,
      reloadEvent$
    ).pipe(
      tap(() => {
        this.isLoading.set(true)
        this.hasError.set(false)
      }),
      switchMap((filterEvent: { type: FILTER_EVENTS }) => {
        if (this.paginator && filterEvent.type === FILTER_EVENTS.FILTER) {
          this.paginator.pageIndex = 0
        }

        const query: ReportPaginationDto = {
          limit: this.paginator?.pageSize || DEFAULT_LIMIT,
          offset: this.paginator?.pageIndex || 0,
        }

        const formValues = this.form().value()

        if (formValues.observation) {
          query.observation = formValues.observation
        }

        if (formValues.reason) {
          query.reason = formValues.reason
        }

        if (!this.database) {
          throw new Error('Não foi possivel se conectar com o serviço responsável pelos dados')
        }

        return this.database
          .get(query)
          .pipe(
            map(({ count, reports }) => {
              this.isLoading.set(false)
              this.resultsLength.set(count)
              this.testData = reports

              return reports
            }),
            catchError(() => {
              this.hasError.set(true)
              this.isLoading.set(false)
              return of([])
            }),
            startWith([]),
          )
      })
    )
  }

  override disconnect(): void {
    // Não há um cleanup necessário no momento
  }
}