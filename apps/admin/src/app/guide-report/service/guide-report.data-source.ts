import { DataSource } from "@angular/cdk/collections";
import { computed, signal } from "@angular/core";
import { toObservable } from '@angular/core/rxjs-interop';
import { FieldTree } from "@angular/forms/signals";
import { MatPaginator } from "@angular/material/paginator";
import { DEFAULT_LIMIT, GUIDE_REPORT_REASON, GuideReportPaginationDto, IPopulatedGuideReportDto } from "@org/contracts";
import { catchError, debounceTime, map, merge, Observable, Subject, switchMap, tap, throwError } from "rxjs";
import { GuideReportService } from "./guide-report.service";

export type GuideReportTableItem = IPopulatedGuideReportDto

type TableForm = FieldTree<{ observation: string, reason: GUIDE_REPORT_REASON | null }>

export class GuideReportTableDataSource extends DataSource<GuideReportTableItem> {
  data: GuideReportTableItem[] = [];

  paginator: MatPaginator | undefined;
  database: GuideReportService | undefined;
  form: TableForm;

  resultsLength = signal(0)
  isLoading = signal(true)
  hasError = signal(false)

  success = computed(() => !this.isLoading() && !this.hasError())

  observationField$;
  reason$;

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

    return merge(this.paginator.page, this.observationField$, this.reason$, this.reload$).pipe(
      debounceTime(250),
      tap(() => {
        this.isLoading.set(true)
        this.hasError.set(false)
      }),
      switchMap((filterEvent: any) => {
        if (this.paginator && filterEvent?.pageIndex && filterEvent?.pageIndex > 0) {
          this.paginator.pageIndex = 0
        }

        const query: GuideReportPaginationDto = {
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
            catchError((error) => {
              this.hasError.set(true)
              this.isLoading.set(false)

              return throwError(() => error)
            }),
            map(({ count, guideReports }) => {
              this.isLoading.set(false)
              this.resultsLength.set(count)
              return guideReports
            })
          )
      })
    )
  }

  override disconnect(): void {
    // Não há um cleanup necessário no momento
  }
}