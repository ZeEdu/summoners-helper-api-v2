import z from "zod";
import { REPORT_REASON } from "../../enums";
import { VALIDATION_ERROR_KEYS } from "../../validation/validation";

export const enumReportReason = z.enum(REPORT_REASON, {
  error: VALIDATION_ERROR_KEYS.enum
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