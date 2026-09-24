import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GuidesPagination } from '../dto/pagination-guides.dto';
import { GuidesService } from '../service/guides.service';

import {
  CreateGuideFormDto,
  CreateGuideFormSchema,
  GuidePaginationDto,
  guidesPaginationSchema,
  UserDtoWithPuuid,
} from '@org/contracts';

import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { HasRiotInfoGuard } from '../../riot-api/guards/has-riot-info.guard';
import { IsGuideCreatorGuard } from '../../riot-api/guards/is-guide-creator.guard';
import { Utils } from '../../utils';
import { PatchGuideDto } from '../dto/patch-guide.dto';

@Controller('guides')
@UseGuards(JwtGuard)
export class GuidesController {
  constructor(private guidesService: GuidesService) { }

  @Get('')
  getGuides(
    @Query(new ZodValidationPipe(guidesPaginationSchema))
    pagination: GuidePaginationDto,
  ) {
    const { offset, limit } = pagination;
    const filter = GuidesPagination.createFilter(pagination);
    return this.guidesService.get(filter, {
      offset,
      limit,
    });
  }

  @Get(':guideId')
  getGuide(@Param('guideId') guideId: string) {
    return this.guidesService.getById(guideId);
  }

  @Post('')
  @UseGuards(HasRiotInfoGuard)
  async createGuide(
    @CurrentUser() user: UserDtoWithPuuid,
    @Body(new ZodValidationPipe(CreateGuideFormSchema))
    body: CreateGuideFormDto,
  ) {
    const createdAt = new Date().toISOString();
    const createdBy = user.id;
    const patchVersion = await Utils.getPatchVersion();

    return this.guidesService.create({
      ...body,
      createdAt,
      createdBy,
      patchVersion,
    });
  }

  @Patch(':guideId')
  @UseGuards(IsGuideCreatorGuard)
  async editGuide(
    @Param('guideId') guideId: string,
    @Body() patchGuide: Partial<PatchGuideDto>,
  ) {
    const updatedAt = new Date().toISOString();
    const patchVersion = await Utils.getPatchVersion();

    return this.guidesService.patch(guideId, {
      ...patchGuide,
      updatedAt,
      patchVersion,
    });
  }

  @Delete(':guideId')
  @UseGuards(IsGuideCreatorGuard)
  deleteGuide(@Param('guideId') guideId: string) {
    return this.guidesService.deleteGuide(guideId);
  }

  @Patch(':guideId')
  // @UseGuards(IsAdmin)
  block(@Param('guideId') guideId: string) {
    return this.guidesService.block(guideId)
  }
}
