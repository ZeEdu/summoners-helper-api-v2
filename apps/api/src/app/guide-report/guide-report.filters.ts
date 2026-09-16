import { GuidePaginationDto } from "@org/contracts"
import { QueryFilter } from "mongoose"
import { GuideReport } from "./schema/guide-report.schema"

function get(query: GuidePaginationDto): QueryFilter<GuideReport> {
  const filter: QueryFilter<GuideReport> = {}

  return filter
}


const GuideReportFilters = {
  get
}


export default GuideReportFilters