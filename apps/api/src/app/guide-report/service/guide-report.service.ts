import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { GuideReport, GuideReportDocument } from '../schema/guide-report.schema';

import { CreateGuideReportDto, DEFAULT_LIMIT, DEFAULT_OFFSET, GUIDE_REPORT_ACTION_TAKEN, GUIDE_REPORT_STATUS, IGuideReport, IPopulatedGuideReport, PaginationDto, sortBuilder } from '@org/contracts';
import ResponseMappers from '../../response-mappers';

@Injectable()
export class GuideReportService {
  constructor(@InjectModel(GuideReport.name) private guideReportModel: Model<GuideReportDocument>) { }

  async get(filter?: QueryFilter<GuideReport>, pagination?: PaginationDto) {
    const limit = pagination?.limit || DEFAULT_LIMIT;
    const offset = pagination?.offset || DEFAULT_OFFSET;
    const sort = sortBuilder(pagination?.sort)

    filter = filter || {};

    const count = await this.guideReportModel.countDocuments(filter);

    const skip = offset * limit

    const guideReports = await this.guideReportModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populate('reportedBy guide')
      .lean<IPopulatedGuideReport[]>();

    return { guideReports: guideReports.map(ResponseMappers.populatedGuideReport), count };
  }

  async getById(guideReportId: string) {
    const guideReport = await this.guideReportModel
      .findById(guideReportId)
      .populate('reportedBy guide')
      .lean<IPopulatedGuideReport>()

    if (guideReport) {
      return ResponseMappers.populatedGuideReport(guideReport)
    }
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

  async block(guideReportId: string) {
    await this.guideReportModel.findByIdAndUpdate(guideReportId, {
      status: GUIDE_REPORT_STATUS.ARCHIVED,
      actionTaken: GUIDE_REPORT_ACTION_TAKEN.BLOCKED
    })
  }

  async unblock(guideReportId: string) {
    await this.guideReportModel.findByIdAndUpdate(guideReportId, {
      status: GUIDE_REPORT_STATUS.ARCHIVED,
      actionTaken: GUIDE_REPORT_ACTION_TAKEN.DISMISS
    })
  }
}
