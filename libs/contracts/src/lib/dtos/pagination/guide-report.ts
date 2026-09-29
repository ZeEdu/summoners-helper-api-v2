import z from "zod";
import { enumGuideReportReason } from "../guide-report";
import { paginationSchema } from "./pagination";

export const guideReportPagination = paginationSchema.safeExtend({
  guide: z.string({ error: 'O campo deve ser uma string' }).optional(),
  reportedBy: z.string({ error: 'O campo deve ser uma string' }).optional(),
  reason: enumGuideReportReason.optional(),
  observation: z.string({ error: 'O campo deve ser uma string' }).optional(),
  createdAt: z.date({ error: 'O campo deve ser uma data valida' }).optional()
})

export type GuideReportPaginationDto = z.infer<typeof guideReportPagination>