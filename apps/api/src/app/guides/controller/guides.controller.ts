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
import { GuidesService } from '../service/guides.service';
import {
  createGuidesPaginationFilter,
  guidesPaginationSchema,
  GuidePaginationDto
} from '../dto/pagination-guides.dto';
import { CreateGuideDto, createGuideSchema } from '../dto/guide/create-guide.dto';
import { PatchGuideDto } from '../dto/patch-guide.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { HasRiotInfoGuard } from '../../riot-api/guards/has-riot-info.guard';
import { IsGuideCreatorGuard } from '../../riot-api/guards/is-guide-creator.guard';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';

@Controller('guides')
@UseGuards(JwtGuard, HasRiotInfoGuard)
export class GuidesController {
  constructor(private guidesService: GuidesService) { }

  @Get('')
  getGuides(
    @Query(new ZodValidationPipe(guidesPaginationSchema))
    pagination: GuidePaginationDto
  ) {
    const { offset, limit } = pagination;
    const filter = createGuidesPaginationFilter(pagination);
    return this.guidesService.getGuides(filter, { offset, limit });
  }

  @Get(':guideId')
  getGuide(@Param('guideId') guideId: string) {
    return this.guidesService.getGuideById(guideId);
  }

  @Post('')
  createGuide(@Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto) {
    return this.guidesService.createGuide(body);
  }

  @Patch(':guideId')
  @UseGuards(IsGuideCreatorGuard)
  editGuide(
    @Param('guideId') guideId: string,
    @Body() patchGuide: Partial<PatchGuideDto>,
  ) {
    return this.guidesService.patchGuide(guideId, patchGuide);
  }

  @Delete(':guideId')
  @UseGuards(IsGuideCreatorGuard)
  deleteGuide(@Param('guideId') guideId: string) {
    return this.guidesService.deleteGuide(guideId);
  }
}
