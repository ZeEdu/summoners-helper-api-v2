import z from "zod";
import { enumReportReason } from "./report.dto";

export const CreateReportSchema = z.object({
  guide: z.string().optional(),
  comment: z.string().optional(),
  reason: enumReportReason,
  observation: z.string(),
})
  .refine((value) => !!(value.comment || value.guide))

export type CreateReportDto = z.infer<typeof CreateReportSchema>