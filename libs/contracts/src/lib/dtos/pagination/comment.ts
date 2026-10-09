import z from "zod"
import { paginationSchema } from "./pagination"

export const commentPagination = paginationSchema.safeExtend({
  id: z.string().optional(),
  createdBy: z.string().optional(),
  guide: z.string().optional(),
  replyTo: z.string().optional(),
})

export type CommentPaginationDto = z.infer<typeof commentPagination>