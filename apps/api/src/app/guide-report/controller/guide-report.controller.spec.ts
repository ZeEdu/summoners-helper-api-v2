import { Test, TestingModule } from '@nestjs/testing';
import { GuideReportController } from './guide-report.controller';

describe('GuideReportController', () => {
  let controller: GuideReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideReportController],
    }).compile();

    controller = module.get<GuideReportController>(GuideReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
