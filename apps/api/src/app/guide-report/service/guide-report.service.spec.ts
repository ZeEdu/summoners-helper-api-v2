import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { GuideReport, GuideReportSchema } from '../schema/guide-report.schema';
import { GuideReportService } from './guide-report.service';

let mongodb: MongoMemoryServer;


describe('GuideReportService', () => {
  let service: GuideReportService;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuideReportService],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: GuideReport.name, schema: GuideReportSchema },
        ])
      ]
    }).compile();

    service = module.get<GuideReportService>(GuideReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
