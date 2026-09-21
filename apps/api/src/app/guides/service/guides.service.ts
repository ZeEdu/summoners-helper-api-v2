import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';

import {
  CreateGuideDto,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  GuideDto,
  IGuide,
  PaginationDto
} from '@org/contracts';

import ResponseMappers from '../../response-mappers';
import { PatchGuideDto } from '../dto/patch-guide.dto';
import { Guide, GuideDocument } from '../schema/guide.schema';

@Injectable()
export class GuidesService {
  constructor(
    @InjectModel(Guide.name) private guideModel: Model<GuideDocument>,
  ) { }

  async get(filter?: QueryFilter<Guide>, pagination?: PaginationDto): Promise<{ guides: GuideDto[], count: number }> {
    const limit = pagination?.limit || DEFAULT_LIMIT;
    const offset = pagination?.offset || DEFAULT_OFFSET;

    filter = filter || {};
    filter.blocked = { $ne: true } // TODO: Não gosto dessa solução, é a mesma que alguns plugin do mongoose utilizam, no entanto, não gosto do $ne

    const count = await this.guideModel.countDocuments(filter);
    const guides = await this.guideModel
      .find(filter)
      .limit(limit)
      .skip(offset * 10)
      .lean<IGuide[]>();

    return { guides: guides.map(ResponseMappers.guide), count };
  }

  async getById(guideId: string): Promise<GuideDto | undefined> {
    const guide = await this.guideModel.findById(guideId).lean<IGuide>()

    if (guide) {
      return ResponseMappers.guide(guide)
    }
  }

  create(guide: CreateGuideDto): Promise<GuideDto> {
    return this.guideModel.create(guide).then(ResponseMappers.guide);
  }

  async patch(
    guideId: string,
    guide: Partial<PatchGuideDto>,
    queryOptions?: QueryOptions<Guide>,
  ): Promise<GuideDto | undefined> {
    const { returnDocument = 'after' } = queryOptions || {};
    const updatedGuide = await this.guideModel
      .findByIdAndUpdate(guideId, guide, {
        ...queryOptions,
        returnDocument,
      })
      .lean<IGuide>();

    if (updatedGuide) {
      return ResponseMappers.guide(updatedGuide)
    }
  }

  deleteGuide(guideId: string) {
    return this.guideModel.deleteOne({ _id: guideId });
  }

  async block(guideId: string) {
    // Tem que notificar:
    // O criador do guia
    // Aqueles que fizeram a denuncia

    await this.guideModel.updateOne({
      _id: guideId,
    }, {
      blocked: true
    })
  }
}
