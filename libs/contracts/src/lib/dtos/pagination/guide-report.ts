import z from "zod";
import { REPORT_ACTION_TAKEN } from "../../enums";
import { enumReportReason } from "../report";
import { paginationSchema } from "./pagination";

export enum REPORT_PAGINATION_TYPE {
  COMMENT = 'COMMENT',
  GUIDE = 'GUIDE'
}

export const reportPagination = paginationSchema.safeExtend({
  guide: z.string().optional(),
  comment: z.string().optional(),
  reportedBy: z.string().optional(),
  reason: enumReportReason.optional(),
  observation: z.string().optional(),
  createdAt: z.date().optional(),
  type: z.enum(REPORT_PAGINATION_TYPE).optional(),
  actionTaken: z.enum(REPORT_ACTION_TAKEN).optional()
})

export type ReportPaginationDto = z.infer<typeof reportPagination>