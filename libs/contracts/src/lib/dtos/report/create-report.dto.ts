import z from "zod";
import { VALIDATION_ERROR_KEYS } from "../../validation/validation";
import { enumReportReason } from "./report.dto";

export const CreateReportSchema = z.object({
  guide: z.string().optional(),
  comment: z.string().optional(),
  reason: enumReportReason,
  observation: z.string(),
})
  .refine((value) => !!(value.comment || value.guide), { error: VALIDATION_ERROR_KEYS.reportTargetRequired })

export type CreateReportDto = z.infer<typeof CreateReportSchema>