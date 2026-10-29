import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as qs from 'qs';

import { IPopulatedReportDto, ReportPaginationDto } from '@org/contracts';

import { API_CONSTANTS } from '../../../endpoint.constants';

const REPORT_ENDPOINT = 'report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient)
  private endpoint = `${API_CONSTANTS.API_URL}/${REPORT_ENDPOINT}`

  get(query: ReportPaginationDto) {
    const queryString = qs.stringify(query)
    const requestUrl = `${this.endpoint}?${queryString}`

    console.log({ query });

    return this.http
      .get<{
        reports: IPopulatedReportDto[];
        count: number;
      }>(requestUrl)
  }

  count(query: Omit<ReportPaginationDto, 'limit' | 'offset' | 'sort'>) {
    const queryString = qs.stringify(query)
    const requestUrl = `${this.endpoint}/count?${queryString}`

    return this.http
      .get<number>(requestUrl)
  }

  archiveReport(guideId: IPopulatedReportDto['id']) {
    const requestUrl = `${this.endpoint}/archive/${guideId}`
    return this.http.patch(requestUrl, {})
  }

  blockReport(guideId: IPopulatedReportDto['id']) {
    const requestUrl = `${this.endpoint}/block/${guideId}`
    return this.http.patch(requestUrl, {})
  }

  unblockReport(guideId: IPopulatedReportDto['id']) {
    const requestUrl = `${this.endpoint}/unblock/${guideId}`
    return this.http.patch(requestUrl, {})
  }
}
