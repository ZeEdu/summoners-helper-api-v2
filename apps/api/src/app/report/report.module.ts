import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CommentsModule } from '../comments/comments.module';
import { IsAdminGuard } from '../guards/is-admin.guard';
import { GuidesModule } from '../guides/guides.module';
import { ReportController } from './controller/report.controller';
import { Report, ReportSchema } from './schema/report.schema';
import { ReportService } from './service/report.service';

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    IsAdminGuard
  ],
  imports: [
    MongooseModule
      .forFeature([
        { name: Report.name, schema: ReportSchema }
      ]),
    AuthModule,
    GuidesModule,
    CommentsModule
  ],
})
export class ReportModule { }
