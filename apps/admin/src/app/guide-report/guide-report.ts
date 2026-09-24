import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { GuideReportService } from './service/guide-report.service';

@Component({
  selector: 'app-guide-report',
  imports: [AsyncPipe],
  templateUrl: './guide-report.html',
  styleUrl: './guide-report.scss',
})
export class GuideReport {
  guideReportService = inject(GuideReportService)

  reports = this.guideReportService
    .get()
    .pipe(tap((response) => {
      console.log({ response });
    }),
      map(() => `Chegou`)
    )
}
