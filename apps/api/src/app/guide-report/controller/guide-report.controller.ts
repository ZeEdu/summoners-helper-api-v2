
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CreateGuideReportFormDto, CreateGuideReportFormSchema, guideReportPagination, GuideReportPaginationDto } from '@org/contracts';

import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import GuideReportFilters from '../guide-report.filters';
import { GuideReportService } from '../service/guide-report.service';

@Controller('guide-report')
@UseGuards(JwtGuard) // IsAdmin
export class GuideReportController {
  constructor(private guideReportService: GuideReportService) { }

  @Get('')
  get(
    @Query(new ZodValidationPipe(guideReportPagination)) pagination: GuideReportPaginationDto
  ) {
    const { offset, limit } = pagination
    const filter = GuideReportFilters.get(pagination)

    return this.guideReportService.get(filter, { offset, limit })
  }

  @Get(':guideReportId')
  getById(@Param('guideReportId') guideReportId: string) {
    return this.guideReportService.getById(guideReportId)
  }

  @Post('')
  // @UseGuards(GuideExists)
  async create(
    @CurrentUser() user: IUserWithPuuid,
    @Body(new ZodValidationPipe(CreateGuideReportFormSchema)) body: CreateGuideReportFormDto
  ) {
    const createdAt = new Date().toISOString()
    const reportedBy = user._id.toString()

    return this.guideReportService.create({ ...body, createdAt, reportedBy })
  }
}
