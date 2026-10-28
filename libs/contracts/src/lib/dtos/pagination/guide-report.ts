import z from "zod";
import { enumReportReason } from "../report";
import { paginationSchema } from "./pagination";

export enum REPORT_PAGINATION_TYPE {
  COMMENT = 'COMMENT',
  GUIDE = 'GUIDE'
}

export const reportPagination = paginationSchema.safeExtend({
  guide: z.string({ error: 'O campo deve ser uma string' }).optional(),
  comment: z.string({ error: 'O campo deve ser uma string' }).optional(),
  reportedBy: z.string({ error: 'O campo deve ser uma string' }).optional(),
  reason: enumReportReason.optional(),
  observation: z.string({ error: 'O campo deve ser uma string' }).optional(),
  createdAt: z.date({ error: 'O campo deve ser uma data valida' }).optional(),
  type: z.enum(REPORT_PAGINATION_TYPE).optional()
})

export type ReportPaginationDto = z.infer<typeof reportPagination>