import z from "zod";
import { enumGuideReportReason } from "./guide-report.dto";

export const CreateGuideReportSchema = z.object({
  guide: z.string({ error: 'O campo deve ser uma string' }),
  reportedBy: z.string({ error: 'O campo deve ser uma string' }),
  reason: enumGuideReportReason,
  observation: z.string({ error: 'O campo deve ser uma string' }),
  createdAt: z.string({ error: 'O campo deve ser uma string' })
})

export type CreateGuideReportDto = z.infer<typeof CreateGuideReportSchema>