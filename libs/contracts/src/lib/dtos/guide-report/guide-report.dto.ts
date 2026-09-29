import z from "zod";
import { GUIDE_REPORT_REASON } from "../../enums";

export const enumGuideReportReason = z.enum(GUIDE_REPORT_REASON, {
  error: 'Valor inválido'
})

export const GuideReportShape = z.object({
  guide: z.string({ error: 'O campo deve ser uma string' }),
  reportedBy: z.string({ error: 'O campo deve ser uma string' }),
  reason: enumGuideReportReason,
  observation: z.string({ error: 'O campo deve ser uma string' }),
  createdAt: z.string({ error: 'O campo deve ser uma string' })
})