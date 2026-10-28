import { REPORT_PAGINATION_TYPE, ReportPaginationDto } from "@org/contracts";
import { QueryFilter } from "mongoose";
import { Report } from "./schema/report.schema";

function get(query: ReportPaginationDto): QueryFilter<Report> {
  const filter: QueryFilter<Report> = {}

  if (query.observation) {
    filter.observation = { $regex: query.observation, $options: 'i' };
  }

  if (query.reason) {
    filter.reason = query.reason
  }

  if (query.type === REPORT_PAGINATION_TYPE.COMMENT) {
    filter.comment = { $exists: true }
  }

  if (query.type === REPORT_PAGINATION_TYPE.GUIDE) {
    filter.guide = { $exists: true }
  }

  return filter
}


const ReportFilters = {
  get
}


export default ReportFilters