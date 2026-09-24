import { TestBed } from '@angular/core/testing';

import { GuideReportService } from './guide-report.service';

describe('GuideReportService', () => {
  let service: GuideReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuideReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
