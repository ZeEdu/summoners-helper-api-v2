import { Test, TestingModule } from '@nestjs/testing';
import { GuideReportService } from './guide-report.service';

describe('GuideReportService', () => {
  let service: GuideReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuideReportService],
    }).compile();

    service = module.get<GuideReportService>(GuideReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
