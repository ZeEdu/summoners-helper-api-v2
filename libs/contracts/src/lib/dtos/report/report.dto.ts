import z from "zod";
import { REPORT_REASON } from "../../enums";

export const enumReportReason = z.enum(REPORT_REASON, {
  error: 'Valor inválido'
})

export const ReportShape = z.object({
  reportedBy: z.string({ error: 'O campo deve ser uma string' }),
  reason: enumReportReason,
  observation: z.string({ error: 'O campo deve ser uma string' }),
  createdAt: z.string({ error: 'O campo deve ser uma string' })
})

export const ReportGuideShape = ReportShape.extend({
  guide: z.string({ error: 'O campo deve ser uma string' })
})

export const ReportCommentShape = ReportShape.extend({
  comment: z.string({ error: 'O campo deve ser uma string' })
})