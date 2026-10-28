import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as qs from 'qs';

import { IPopulatedReportDto, REPORT_PAGINATION_TYPE, ReportPaginationDto } from '@org/contracts';

import { API_CONSTANTS } from '../../endpoint.constants';

const GUIDE_REPORT_ENDPOINT = 'guide-report';

@Injectable({
  providedIn: 'root',
})
export class GuideReportService {
  private http = inject(HttpClient)
  private endpoint = `${API_CONSTANTS.API_URL}/${GUIDE_REPORT_ENDPOINT}`

  get(query: ReportPaginationDto) {
    if (!query.guide) {
      query.type = REPORT_PAGINATION_TYPE.GUIDE
    }

    const queryString = qs.stringify(query)
    const requestUrl = `${this.endpoint}?${queryString}`

    return this.http
      .get<{
        reports: IPopulatedReportDto[];
        count: number;
      }>(requestUrl)
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
