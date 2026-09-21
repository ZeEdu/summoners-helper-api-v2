import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { GuideReport, GuideReportSchema } from '../schema/guide-report.schema';
import { GuideReportService } from '../service/guide-report.service';
import { GuideReportController } from './guide-report.controller';

let mongodb: MongoMemoryServer;

describe('GuideReportController', () => {
  let controller: GuideReportController;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideReportController],
      providers: [GuideReportService],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          {
            name: GuideReport.name,
            schema: GuideReportSchema
          },
        ])]
    }).compile();

    controller = module.get<GuideReportController>(GuideReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
