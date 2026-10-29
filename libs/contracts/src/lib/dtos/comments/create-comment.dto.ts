import z from "zod";

export const createCommentFormSchema = z.object({
  content: z.string().min(1),
  guide: z.string()
})

export type CreateCommentFormType = z.infer<typeof createCommentFormSchema>

export const createCommentSchema = z.object({
  content: z.string(),
  createdBy: z.string(),
  guide: z.string(),
  createdAt: z.iso.datetime(),
  replyTo: z.string().optional()
})

export type CreateCommentDto = z.infer<typeof createCommentSchema>
