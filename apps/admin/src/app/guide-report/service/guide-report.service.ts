import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../endpoint.constants';

import * as qs from 'qs';

import { GuideReportPaginationDto, IPopulatedGuideReportDto } from '@org/contracts';

const GUIDE_REPORT_ENDPOINT = 'guide-report';

@Injectable({
  providedIn: 'root',
})
export class GuideReportService {
  private http = inject(HttpClient)

  private endpoint = `${API_CONSTANTS.API_URL}/${GUIDE_REPORT_ENDPOINT}`

  get(query: GuideReportPaginationDto) {
    const queryString = qs.stringify(query)
    const requestUrl = `${this.endpoint}?${queryString}`

    return this.http.get<{
      guideReports: IPopulatedGuideReportDto[];
      count: number;
    }>(requestUrl)
  }

  archiveReport(guideId: IPopulatedGuideReportDto['id']) {
    const requestUrl = `${this.endpoint}/archive/${guideId}`
    return this.http.patch(requestUrl, {})
  }

  blockReport(guideId: IPopulatedGuideReportDto['id']) {
    const requestUrl = `${this.endpoint}/block/${guideId}`
    return this.http.patch(requestUrl, {})
  }

  unblockReport(guideId: IPopulatedGuideReportDto['id']) {
    const requestUrl = `${this.endpoint}/unblock/${guideId}`
    return this.http.patch(requestUrl, {})
  }
}
