import z from "zod";
import { enumReportReason } from "./report.dto";

export const CreateReportSchema = z.object({
  guide: z.string({ error: 'O campo deve ser uma string' }),
  comment: z.string({ error: 'O campo deve ser uma string' }),
  reportedBy: z.string({ error: 'O campo deve ser uma string' }),
  reason: enumReportReason,
  observation: z.string({ error: 'O campo deve ser uma string' }),
  createdAt: z.string({ error: 'O campo deve ser uma string' })
})
  .refine(
    (value) => !!(value.comment || value.guide),
    {
      error: '`guide` ou `comment` devem ser fornecidos'
    }
  )

export type CreateReportDto = z.infer<typeof CreateReportSchema>