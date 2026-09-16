import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { GuideReport, GuideReportDocument, IPopulatedGuideReport } from '../schema/guide-report.schema';

import { CreateGuideReportDto, DEFAULT_LIMIT, DEFAULT_OFFSET, IGuideReport, PaginationDto } from '@org/contracts';

@Injectable()
export class GuideReportService {
  constructor(@InjectModel(GuideReport.name) private guideReportModel: Model<GuideReportDocument>) { }

  async get(filter?: QueryFilter<GuideReport>, pagination?: PaginationDto) {
    const limit = pagination?.limit || DEFAULT_LIMIT;
    const offset = pagination?.offset || DEFAULT_OFFSET;

    filter = filter || {};

    const count = await this.guideReportModel.countDocuments(filter);
    const guideReports = await this.guideReportModel
      .find(filter)
      .limit(limit)
      .skip(offset * 10)
      .populate('reportedBy guide')
      .lean<IPopulatedGuideReport[]>();

    return { guideReports, count };
  }

  getById(guideReportId: string) {
    return this.guideReportModel
      .findById(guideReportId)
      .populate('reportedBy guide')
      .lean<IPopulatedGuideReport[]>();
  }

  create(guideReport: CreateGuideReportDto) {
    return this.guideReportModel.create(guideReport)
  }

  patch(guideReportId: string, guideReport: Partial<IGuideReport>, queryOptions?: QueryOptions<GuideReport>) {
    const { returnDocument = 'after' } = queryOptions || {}

    return this.guideReportModel.findByIdAndUpdate(guideReportId, guideReport, {
      ...queryOptions,
      returnDocument
    })
      .lean<IGuideReport>()
  }

  delete(guideId: string) {
    return this.guideReportModel.deleteOne({ _id: guideId })
  }
}
