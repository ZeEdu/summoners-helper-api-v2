import { GuideReportPaginationDto } from "@org/contracts";
import { QueryFilter } from "mongoose";
import { GuideReport } from "./schema/guide-report.schema";

function get(query: GuideReportPaginationDto): QueryFilter<GuideReport> {
  const filter: QueryFilter<GuideReport> = {}

  if (query.observation) {
    filter.observation = { $regex: query.observation, $options: 'i' };
  }

  if (query.reason) {
    filter.reason = query.reason
  }

  return filter
}


const GuideReportFilters = {
  get
}


export default GuideReportFilters