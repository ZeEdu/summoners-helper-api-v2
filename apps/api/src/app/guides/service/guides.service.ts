import { Injectable } from '@nestjs/common';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  PaginationDto,
} from '../../pagination/pagination.dto';
import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Guide, IGuide } from '../schema/guide.schema';
import { CreateGuideDto } from '../dto/create-guide.dto';
import { PatchGuideDto } from '../dto/patch-guide.dto';
import { IUser } from '@org/shared-libs';

@Injectable()
export class GuidesService {
  constructor(@InjectModel(Guide.name) private guideModel: Model<Guide>) { }

  async getGuides(filter?: QueryFilter<Guide>, pagination?: PaginationDto) {
    const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = pagination || {};
    filter = filter || {};

    const count = await this.guideModel.countDocuments(filter);
    const guides = await this.guideModel
      .find(filter)
      .limit(limit)
      .skip(offset)
      .lean<IUser[]>();

    return { guides, count };
  }

  getGuideById(guideId: string) {
    return this.guideModel.findById(guideId).lean<IUser[]>();
  }

  createGuide(guide: CreateGuideDto) {
    return this.guideModel.insertOne(guide);
  }

  patchGuide(
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
}
