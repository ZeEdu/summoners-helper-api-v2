import { IsAdminGuard } from '../../guards/is-admin.guard';
import { GuidesService } from '../../guides/service/guides.service';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';

import {
  CreateReportDto,
  CreateReportSchema,
  REPORT_ACTION_TAKEN,
  REPORT_STATUS,
  reportPagination,
  ReportPaginationDto,
  UserDto,
} from '@org/contracts';

import { CommentsService } from '../../comments/service/comments.service';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import ReportFilters from '../report.filters';
import { ReportService } from '../service/report.service';

@Controller('report')
@UseGuards(JwtGuard, IsAdminGuard)
export class ReportController {
  constructor(
    private reportService: ReportService,
    private guideService: GuidesService,
    private commentService: CommentsService
  ) { }

  @Get('')
  get(
    @Query(new ZodValidationPipe(reportPagination)) pagination: ReportPaginationDto,
  ) {
    const { offset, limit, sort } = pagination;
    const filter = ReportFilters.get(pagination);

    return this.reportService.get(filter, { offset, limit, sort });
  }

  @Get('count')
  getCount(
    @Query(new ZodValidationPipe(reportPagination)) pagination: ReportPaginationDto,
  ) {
    return this.reportService.count(ReportFilters.get(pagination));
  }

  @Get(':reportId')
  getById(
    @Param('reportId') reportId: string
  ) {
    return this.reportService.getById(reportId);
  }

  @Post('')
  async create(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(CreateReportSchema)) body: CreateReportDto,
  ) {
    const createdAt = new Date().toISOString();
    const reportedBy = user.id;

    return this.reportService.create({ ...body, createdAt, reportedBy });
  }

  @Patch('archive/:reportId')
  async archive(
    @Param('reportId') reportId: string
  ) {
    const report = await this.reportService.getById(reportId);
    if (!report) {
      throw new BadRequestException('Denuncia não foi encontrada');
    }

    if (report.status === REPORT_STATUS.ARCHIVED) {
      throw new BadRequestException('Denuncia já se encontra arquivada');
    }

    await this.reportService.patch(report.id, {
      status: REPORT_STATUS.ARCHIVED,
      actionTaken: REPORT_ACTION_TAKEN.DISMISS,
    });
  }

  @Patch('block/:reportId')
  async block(
    @Param('reportId') reportId: string
  ) {
    const report = await this.reportService.getById(reportId);
    if (!report) {
      throw new BadRequestException('Denuncia não foi encontrada');
    }

    if (report.guide) {
      await this.guideService.block(report.guide.id);
    }

    if (report.comment) {
      await this.commentService.block(report.comment.id)
    }

    await this.reportService.block(report.id);
  }

  @Patch('unblock/:reportId')
  async unblock(
    @Param('reportId') reportId: string
  ) {
    const report = await this.reportService.getById(reportId);
    if (!report) {
      throw new BadRequestException('Denuncia não foi encontrada');
    }

    if (report.actionTaken === REPORT_ACTION_TAKEN.DISMISS) {
      throw new BadRequestException('Denuncia já foi descartada');
    }

    if (report.guide) {
      await this.guideService.unblock(report.guide.id);
    }

    if (report.comment) {
      await this.commentService.unblock(report.comment.id);
    }

    await this.reportService.unblock(report.id);
  }
}
