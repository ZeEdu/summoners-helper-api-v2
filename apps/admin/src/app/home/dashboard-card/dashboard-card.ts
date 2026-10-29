import { Component, inject, Input, OnInit } from "@angular/core";
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { AsyncPipe } from "@angular/common";
import { REPORT_ACTION_TAKEN, REPORT_PAGINATION_TYPE } from "@org/contracts";
import { map, Observable } from "rxjs";
import { ReportService } from "../../services/report/service/report.service";

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatCardActions,
    MatAnchor,
    RouterLink,
    AsyncPipe
  ]
})
export class DashboardCard implements OnInit {
  @Input() mode: REPORT_PAGINATION_TYPE
  @Input() link: string
  @Input() title: string
  @Input() icon: string

  reportService = inject(ReportService)

  count$: Observable<{ value: number }>

  ngOnInit(): void {
    this.count$ = this.reportService
      .count({
        type: this.mode,
        actionTaken: REPORT_ACTION_TAKEN.WAITING
      })
      .pipe(
        map((value) => ({ value }))
      )
  }
}