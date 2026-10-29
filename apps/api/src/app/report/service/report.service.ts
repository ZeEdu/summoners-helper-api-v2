import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { Report, ReportDocument } from '../schema/report.schema';

import { CreateReportDto, DEFAULT_LIMIT, DEFAULT_OFFSET, IPopulatedReport, IReport, PaginationDto, REPORT_ACTION_TAKEN, REPORT_STATUS, sortBuilder } from '@org/contracts';
import ResponseMappers from '../../response-mappers';

@Injectable()
export class ReportService {
  constructor(@InjectModel(Report.name) private reportModel: Model<ReportDocument>) { }

  async get(filter?: QueryFilter<Report>, pagination?: PaginationDto) {
    const limit = pagination?.limit || DEFAULT_LIMIT;
    const offset = pagination?.offset || DEFAULT_OFFSET;
    const sort = sortBuilder(pagination?.sort)

    filter = filter || {};

    const count = await this.reportModel.countDocuments(filter);

    const skip = offset * limit

    console.log({ filter });

    const reports = await this.reportModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populate('reportedBy guide comment')
      .lean<IPopulatedReport[]>();

    return {
      reports: reports.map(ResponseMappers.populatedReport),
      count
    };
  }

  async count(filter?: QueryFilter<Report>) {
    return this.reportModel.countDocuments(filter)
  }

  async getById(reportId: string) {
    const report = await this.reportModel
      .findById(reportId)
      .populate('reportedBy guide comment')
      .lean<IPopulatedReport>()

    if (report) {
      return ResponseMappers.populatedReport(report)
    }
  }

  create(report: CreateReportDto) {
    return this.reportModel.create(report)
  }

  patch(reportId: string, updatedReport: Partial<IReport>, queryOptions?: QueryOptions<Report>) {
    const { returnDocument = 'after' } = queryOptions || {}

    return this.reportModel.findByIdAndUpdate(reportId, updatedReport, {
      ...queryOptions,
      returnDocument
    })
      .lean<IReport>()
  }

  delete(reportId: string) {
    return this.reportModel.deleteOne({ _id: reportId })
  }

  async block(reportId: string) {
    await this.reportModel
      .findByIdAndUpdate(reportId, {
        status: REPORT_STATUS.ARCHIVED,
        actionTaken: REPORT_ACTION_TAKEN.BLOCKED
      })
  }

  async unblock(reportId: string) {
    await this.reportModel
      .findByIdAndUpdate(reportId, {
        status: REPORT_STATUS.ARCHIVED,
        actionTaken: REPORT_ACTION_TAKEN.DISMISS
      })
  }
}
