import z from "zod";
import { REPORT_REASON } from "../../enums";

export const enumReportReason = z.enum(REPORT_REASON, {
  error: 'Valor inválido'
})

export const ReportShape = z.object({
  reportedBy: z.string(),
  reason: enumReportReason,
  observation: z.string(),
  createdAt: z.string()
})

export const ReportGuideShape = ReportShape.extend({
  guide: z.string()
})

export const ReportCommentShape = ReportShape.extend({
  comment: z.string()
})