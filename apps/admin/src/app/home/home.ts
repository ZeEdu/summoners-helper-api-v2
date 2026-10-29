import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

import { REPORT_PAGINATION_TYPE } from '@org/contracts';

import { DashboardCard } from './dashboard-card/dashboard-card';
import { QuickAccessCard } from './quick-access-card/quick-access-card';

@Component({
  selector: 'app-home',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    DashboardCard,
    QuickAccessCard
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  REPORT_PAGINATION_TYPE = REPORT_PAGINATION_TYPE;
}
