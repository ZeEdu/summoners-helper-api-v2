import { AfterViewInit, Component, inject, signal, ViewChild } from "@angular/core";
import { form, FormField } from "@angular/forms/signals";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTable, MatTableModule } from "@angular/material/table";

import { DEFAULT_LIMIT, IPopulatedReportDto, REPORT_ACTION_TAKEN, REPORT_PAGINATION_TYPE, REPORT_REASON, REPORT_STATUS } from "@org/contracts";

import { LayoutModule } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ReportTableDataSource, ReportTableItem } from "../../services/report/report.data-source";
import { ReportService } from "../../services/report/service/report.service";
import { GuideReview, REVIEW_ACTIONS } from "../guide-report/guide-review/guide-review";

@Component({
  selector: 'app-comment-report',
  templateUrl: './comment-report.html',
  styleUrl: './comment-report.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelect,
    MatOption,
    FormField,
    MatProgressSpinnerModule,
    LayoutModule,
    MatDialogModule
  ]
})
export class CommentReport implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<ReportTableItem>;

  private dialog = inject(MatDialog)
  private snackBar = inject(MatSnackBar);

  private reportService = inject(ReportService);

  dataSource: ReportTableDataSource;

  REPORT_ACTION_TAKEN = REPORT_ACTION_TAKEN;
  REPORT_STATUS = REPORT_STATUS;

  REASONS_OPTIONS = [
    {
      value: REPORT_REASON.INAPPROPRIATE_CONTENT,
      label: 'Conteúdo impróprio',
    },
    {
      value: REPORT_REASON.INCORRECT_INFORMATION,
      label: 'Informação falsa',
    },
    {
      value: REPORT_REASON.SPAM,
      label: 'Spam',
    },
    {
      value: REPORT_REASON.ADVERTISING,
      label: 'Anúncio',
    },
    {
      value: REPORT_REASON.HARASSMENT,
      label: 'Assédio',
    },
    {
      value: REPORT_REASON.COPYRIGHT,
      label: 'Direitos Autorais',
    },
    {
      value: REPORT_REASON.EXPLOIT_OR_CHEATING,
      label: 'trapaça',
    },
    {
      value: REPORT_REASON.OTHER,
      label: 'Outro',
    },
  ];

  private commentReportPaginationFormModel = signal<{
    observation: string;
    reason: REPORT_REASON | null;
  }>({
    observation: '',
    reason: null,
  });

  paginationForm = form(this.commentReportPaginationFormModel);

  displayedColumns: string[] = [
    'id',
    'observation',
    'reason',
    'status',
    'actionTaken',
    'actions',
  ];

  querySort: Sort | null = null;

  pageSize = DEFAULT_LIMIT;
  pageIndex = 0;

  pageSizeOptions = [5, 10, 25, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  constructor() {
    this.dataSource = new ReportTableDataSource(this.paginationForm, REPORT_PAGINATION_TYPE.COMMENT);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.database = this.reportService;

    this.table.dataSource = this.dataSource;
  }

  resetFilter() {
    this.paginationForm().reset({
      observation: '',
      reason: null,
    });

    this.paginator.firstPage();
  }

  undoReport(commentReport: IPopulatedReportDto) {
    this.reportService.unblockReport(commentReport.id).subscribe({
      next: () => {
        this.dataSource.reloadTable();
        this.snackBar.open('Guia desbloquado com sucesso', 'Fechar', {
          duration: 3_000,
        });
      },
    });
  }

  archiveReport(commentReport: IPopulatedReportDto) {
    this.reportService.archiveReport(commentReport.id).subscribe({
      next: () => {
        this.dataSource.reloadTable();
        this.snackBar.open('Denuncia arquivada com sucesso', 'Fechar', {
          duration: 3_000,
        });
      },
    });
  }

  acceptReport(commentReport: IPopulatedReportDto) {
    this.reportService.blockReport(commentReport.id).subscribe({
      next: () => {
        this.dataSource.reloadTable();
        this.snackBar.open('Denuncia aceita com sucesso', 'Fechar', {
          duration: 3_000,
        });
      },
    });
  }

  reviewComment(commentReport: IPopulatedReportDto) {
    const dialogRef = this.dialog.open(GuideReview, { data: commentReport, maxWidth: 1200 })

    dialogRef.afterClosed()
      .subscribe({
        next: (result) => {
          if (result === REVIEW_ACTIONS.ACCEPT) {
            this.acceptReport(commentReport)
          }

          if (result === REVIEW_ACTIONS.ARCHIVE) {
            this.archiveReport(commentReport)
          }

          if (result === REVIEW_ACTIONS.UNDO) {
            this.undoReport(commentReport)
          }
        }
      })
  }

}