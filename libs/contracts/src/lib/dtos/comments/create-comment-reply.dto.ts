import z from "zod";
import { createCommentFormSchema, createCommentSchema } from "./create-comment.dto";

export const createCommentReplyFormSchema = createCommentFormSchema.safeExtend({
  replyTo: z.string(),
})

export type CreateCommentReplyFormType = z.infer<typeof createCommentReplyFormSchema>

export const createCommentReplySchema = createCommentSchema.safeExtend({
  replyTo: z.string(),
})

export type CreateCommentReplyType = z.infer<typeof createCommentReplySchema>