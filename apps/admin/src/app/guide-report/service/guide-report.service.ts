import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../endpoint.constants';

const GUIDE_REPORT_ENDPOINT = 'guide-report';

@Injectable({
  providedIn: 'root',
})
export class GuideReportService {
  private http = inject(HttpClient)

  private endpoint = `${API_CONSTANTS.API_URL}/${GUIDE_REPORT_ENDPOINT}`

  get() {
    return this.http.get(this.endpoint)
  }
}
