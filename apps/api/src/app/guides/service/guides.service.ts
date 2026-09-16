import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';

import {
  CreateGuideDto,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  IGuide,
  IUser,
  PaginationDto,
} from '@org/contracts';

import { PatchGuideDto } from '../dto/patch-guide.dto';
import { Guide, GuideDocument } from '../schema/guide.schema';

@Injectable()
export class GuidesService {
  constructor(
    @InjectModel(Guide.name) private guideModel: Model<GuideDocument>,
  ) { }

  async get(filter?: QueryFilter<Guide>, pagination?: PaginationDto) {
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

    return { guides, count };
  }

  getById(guideId: string) {
    return this.guideModel.findById(guideId).lean<IUser[]>();
  }

  create(guide: CreateGuideDto) {
    return this.guideModel.create(guide);
  }

  patch(
    guideId: string,
    guide: Partial<PatchGuideDto>,
    queryOptions?: QueryOptions<Guide>,
  ) {
    const { returnDocument = 'after' } = queryOptions || {};
    // Impedir o update de certos campos
    return this.guideModel
      .findByIdAndUpdate(guideId, guide, {
        ...queryOptions,
        returnDocument,
      })
      .lean<IGuide>();
  }

  deleteGuide(guideId: string) {
    return this.guideModel.deleteOne({ _id: guideId });
  }

  block(guideId: string) {
    // Tem que notificar:
    // O criador do guia
    // Aqueles que fizeram a denuncia

    return this.guideModel.updateOne({
      _id: guideId,
    }, {
      blocked: true
    })


  }
}
