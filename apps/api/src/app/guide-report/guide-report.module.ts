import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { IsAdminGuard } from '../guards/is-admin.guard';
import { GuidesModule } from '../guides/guides.module';
import { GuideReportController } from './controller/guide-report.controller';
import { GuideReport, GuideReportSchema } from './schema/guide-report.schema';
import { GuideReportService } from './service/guide-report.service';

@Module({
  controllers: [GuideReportController],
  providers: [GuideReportService, IsAdminGuard],
  imports: [
    MongooseModule.forFeature([{ name: GuideReport.name, schema: GuideReportSchema }]),
    AuthModule,
    GuidesModule
  ],
})
export class GuideReportModule { }
