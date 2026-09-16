import z from "zod";
import { CreateGuideReportSchema } from "./create-guide-report.dto";

export const CreateGuideReportFormSchema = CreateGuideReportSchema.pick({
  guide: true,
  observation: true,
  reason: true,
})

export type CreateGuideReportFormDto = z.infer<typeof CreateGuideReportFormSchema>