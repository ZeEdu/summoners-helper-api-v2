import { DataSource } from "@angular/cdk/collections";
import { signal } from "@angular/core";
import { toObservable } from '@angular/core/rxjs-interop';
import { FieldTree } from "@angular/forms/signals";
import { MatPaginator } from "@angular/material/paginator";
import { DEFAULT_LIMIT, GUIDE_REPORT_REASON, GuideReportPaginationDto, IPopulatedGuideReportDto } from "@org/contracts";
import { catchError, debounceTime, map, merge, Observable, of, pipe, startWith, Subject, switchMap, tap } from "rxjs";
import { GuideReportService } from "./guide-report.service";


export type GuideReportTableItem = IPopulatedGuideReportDto

type TableForm = FieldTree<{ observation: string, reason: GUIDE_REPORT_REASON | null }>

export class GuideReportTableDataSource extends DataSource<GuideReportTableItem> {

  data: GuideReportTableItem[] = [];

  paginator: MatPaginator | undefined;
  // sort: MatSort | undefined;
  database: GuideReportService | undefined;
  form: TableForm;

  resultsLength = signal(0)
  isLoadingResults = signal(true);

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
      .pipe(debounceTime(250))
    this.reason$ = toObservable(this.form.reason().value)
      .pipe(debounceTime(250))
  }

  reloadTable() {
    this._reload.next()
  }

  override connect(): Observable<GuideReportTableItem[]> {
    console.log({ paginator: this.paginator, database: this.database, form: this.form });

    if (!this.paginator || !this.database || !this.form) {

      throw Error(
        'Please set the paginator, sort and database on the data source before connecting.'
      );
    }

    return merge(this.paginator.page, this.observationField$, this.reason$, this.reload$).pipe(
      pipe(
        startWith({}),
        tap(() => {
          this.isLoadingResults.set(true)
        }),
        switchMap(() => {
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

          return this.database!
            .get(query)
            .pipe(
              catchError(() => of({
                guideReports: [],
                count: 0
              })),
              map(({ count, guideReports }) => {
                this.isLoadingResults.set(false)
                this.resultsLength.set(count)
                return guideReports
              })
            )
        })
      )
    )
  }

  override disconnect(): void {
    // Não há um clean necessário no momento
  }
}