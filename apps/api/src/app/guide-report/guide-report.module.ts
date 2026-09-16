import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuideReportController } from './controller/guide-report.controller';
import { GuideReport, GuideReportSchema } from './schema/guide-report.schema';
import { GuideReportService } from './service/guide-report.service';

@Module({
  controllers: [GuideReportController],
  providers: [GuideReportService],
  imports: [
    MongooseModule.forFeature([{ name: GuideReport.name, schema: GuideReportSchema }]),
  ],
})
export class GuideReportModule { }
