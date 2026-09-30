import { IsAdminGuard } from './../../guards/is-admin.guard';
import { GuidesService } from './../../guides/service/guides.service';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  CreateGuideReportFormDto,
  CreateGuideReportFormSchema,
  GUIDE_REPORT_ACTION_TAKEN,
  GUIDE_REPORT_STATUS,
  guideReportPagination,
  GuideReportPaginationDto,
} from '@org/contracts';

import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import GuideReportFilters from '../guide-report.filters';
import { GuideReportService } from '../service/guide-report.service';

@Controller('guide-report')
@UseGuards(JwtGuard, IsAdminGuard)
export class GuideReportController {
  constructor(
    private guideReportService: GuideReportService,
    private guideService: GuidesService,
  ) {}

  @Get('')
  get(
    @Query(new ZodValidationPipe(guideReportPagination))
    pagination: GuideReportPaginationDto,
  ) {
    const { offset, limit, sort } = pagination;
    const filter = GuideReportFilters.get(pagination);

    return this.guideReportService.get(filter, { offset, limit, sort });
  }

  @Get(':guideReportId')
  getById(@Param('guideReportId') guideReportId: string) {
    return this.guideReportService.getById(guideReportId);
  }

  @Post('')
  // @UseGuards(GuideExists)
  async create(
    @CurrentUser() user: IUserWithPuuid,
    @Body(new ZodValidationPipe(CreateGuideReportFormSchema))
    body: CreateGuideReportFormDto,
  ) {
    const createdAt = new Date().toISOString();
    const reportedBy = user._id.toString();

    return this.guideReportService.create({ ...body, createdAt, reportedBy });
  }

  @Patch('archive/:guideReportId')
  async archive(@Param('guideReportId') guideReportId: string) {
    // Apenas arquiva a denuncia
    const guideReport = await this.guideReportService.getById(guideReportId);
    if (!guideReport) {
      throw new BadRequestException('Denuncia não foi encontrada');
    }

    if (guideReport.status === GUIDE_REPORT_STATUS.ARCHIVED) {
      throw new BadRequestException('Denuncia já se encontra arquivada');
    }

    await this.guideReportService.patch(guideReport.id, {
      status: GUIDE_REPORT_STATUS.ARCHIVED,
      actionTaken: GUIDE_REPORT_ACTION_TAKEN.DISMISS,
    });
  }

  @Patch('block/:guideReportId')
  async block(@Param('guideReportId') guideReportId: string) {
    const guideReport = await this.guideReportService.getById(guideReportId);
    if (!guideReport) {
      throw new BadRequestException('Denuncia não foi encontrada');
    }

    await this.guideService.block(guideReport.guide.id);
    await this.guideReportService.block(guideReport.id);

    // Bloquear o guide
    // Atualizar o report - status (ARCHIVED) - actionTaken (BLOCKED)
    // Atualizar todas as denuncias de um mesmo guia
    // Notificar criador do guia
    // Notificar quem fez a denuncia
  }

  @Patch('unblock/:guideReportId')
  async unblock(@Param('guideReportId') guideReportId: string) {
    const guideReport = await this.guideReportService.getById(guideReportId);
    if (!guideReport) {
      throw new BadRequestException('Denuncia não foi encontrada');
    }

    if (guideReport.actionTaken === GUIDE_REPORT_ACTION_TAKEN.DISMISS) {
      throw new BadRequestException('Denuncia já foi descartada');
    }

    await this.guideService.unblock(guideReport.guide.id);
    await this.guideReportService.unblock(guideReport.id);

    // Desbloquar o guide
    // Atualizar o report - status (ARCHIVED) - actionTaken (DISMISS)
    // Arquivar todas as denuncias do guia mesmo guia
    // Notificar criador do guia
    // Notificar quem fez a denuncia
  }
}
