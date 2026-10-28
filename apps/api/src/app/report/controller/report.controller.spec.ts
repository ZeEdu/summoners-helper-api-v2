import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthService } from '../../auth/service/auth.service';
import { CommentsModule } from '../../comments/comments.module';
import { IsAdminGuard } from '../../guards/is-admin.guard';
import { GuidesModule } from '../../guides/guides.module';
import { Report, ReportSchema } from '../schema/report.schema';
import { ReportService } from '../service/report.service';
import { ReportController } from './report.controller';

let mongodb: MongoMemoryServer;

describe('GuideReportController', () => {
  let controller: ReportController;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        ReportService,
        IsAdminGuard,
        {
          provide: AuthService,
          useValue: {
            validateSystemAdmin: jest.fn(),
          },
        }
      ],
      imports: [
        GuidesModule,
        CommentsModule,
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          {
            name: Report.name,
            schema: ReportSchema
          },
        ])]
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
