import { LayoutModule } from '@angular/cdk/layout';
import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';

import {
  DEFAULT_LIMIT,
  GUIDE_REPORT_ACTION_TAKEN,
  GUIDE_REPORT_REASON,
  GUIDE_REPORT_STATUS,
  IPopulatedGuideReportDto
} from '@org/contracts';

import { form, FormField } from '@angular/forms/signals';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { GUIDE_REVIEW_ACTIONS, GuideReview } from './guide-review/guide-review';
import { GuideReportTableDataSource, GuideReportTableItem } from './service/guide-report.data-source';
import { GuideReportService } from './service/guide-report.service';

@Component({
  selector: 'app-guide-report',
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
  ],
  templateUrl: './guide-report.html',
  styleUrl: './guide-report.scss',
})
export class GuideReport implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<GuideReportTableItem>;

  private dialog = inject(MatDialog)
  private snackBar = inject(MatSnackBar);

  private guideReportService = inject(GuideReportService);


  dataSource: GuideReportTableDataSource;

  GUIDE_REPORT_ACTION_TAKEN = GUIDE_REPORT_ACTION_TAKEN;
  GUIDE_REPORT_STATUS = GUIDE_REPORT_STATUS;

  REASONS_OPTIONS = [
    {
      value: GUIDE_REPORT_REASON.INAPPROPRIATE_CONTENT,
      label: 'Conteúdo impróprio',
    },
    {
      value: GUIDE_REPORT_REASON.INCORRECT_INFORMATION,
      label: 'Informação falsa',
    },
    {
      value: GUIDE_REPORT_REASON.SPAM,
      label: 'Spam',
    },
    {
      value: GUIDE_REPORT_REASON.ADVERTISING,
      label: 'Anúncio',
    },
    {
      value: GUIDE_REPORT_REASON.HARASSMENT,
      label: 'Assédio',
    },
    {
      value: GUIDE_REPORT_REASON.COPYRIGHT,
      label: 'Direitos Autorais',
    },
    {
      value: GUIDE_REPORT_REASON.EXPLOIT_OR_CHEATING,
      label: 'trapaça',
    },
    {
      value: GUIDE_REPORT_REASON.OTHER,
      label: 'Outro',
    },
  ];

  private guideReportPaginationFormModel = signal<{
    observation: string;
    reason: GUIDE_REPORT_REASON | null;
  }>({
    observation: '',
    reason: null,
  });

  paginationForm = form(this.guideReportPaginationFormModel);

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
    this.dataSource = new GuideReportTableDataSource(this.paginationForm);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.database = this.guideReportService;

    this.table.dataSource = this.dataSource;
  }

  resetFilter() {
    this.paginationForm().reset({
      observation: '',
      reason: null,
    });

    this.paginator.firstPage();
  }

  undoReport(guideReport: IPopulatedGuideReportDto) {
    this.guideReportService.unblockReport(guideReport.id).subscribe({
      next: () => {
        this.dataSource.reloadTable();
        this.snackBar.open('Guia desbloquado com sucesso', 'Fechar', {
          duration: 3_000,
        });
      },
    });
  }

  archiveReport(guideReport: IPopulatedGuideReportDto) {
    this.guideReportService.archiveReport(guideReport.id).subscribe({
      next: () => {
        this.dataSource.reloadTable();
        this.snackBar.open('Denuncia arquivada com sucesso', 'Fechar', {
          duration: 3_000,
        });
      },
    });
  }

  acceptReport(guideReport: IPopulatedGuideReportDto) {
    this.guideReportService.blockReport(guideReport.id).subscribe({
      next: () => {
        this.dataSource.reloadTable();
        this.snackBar.open('Denuncia aceita com sucesso', 'Fechar', {
          duration: 3_000,
        });
      },
    });
  }

  reviewGuide(guideReport: IPopulatedGuideReportDto) {
    const dialogRef = this.dialog.open(GuideReview, { data: guideReport, maxWidth: 1200 })

    dialogRef.afterClosed()
      .subscribe({
        next: (result) => {
          if (result === GUIDE_REVIEW_ACTIONS.ACCEPT) {
            this.acceptReport(guideReport)
          }

          if (result === GUIDE_REVIEW_ACTIONS.ARCHIVE) {
            this.archiveReport(guideReport)
          }

          if (result === GUIDE_REVIEW_ACTIONS.UNDO) {
            this.undoReport(guideReport)
          }
        }
      })
  }
}
