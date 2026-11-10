import z from "zod";
import { VALIDATION_ERROR_KEYS } from "../../validation";
import { enumReportReason } from "./report.dto";

export const createReportSchema = z.object({
  guide: z.string().optional(),
  comment: z.string().optional(),
  reason: enumReportReason,
  observation: z.string(),
})
  .refine((value) => !!(value.comment || value.guide), { params: { validation: VALIDATION_ERROR_KEYS.reportTargetRequired } })

export type CreateReportDto = z.infer<typeof createReportSchema>