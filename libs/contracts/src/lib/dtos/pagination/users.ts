import z from "zod";
import { paginationSchema } from "./pagination";

export const usersPaginationSchema = paginationSchema.safeExtend({
  username: z.string().optional(),
  email: z.string().optional(),
})

export type UsersPaginationDto = z.infer<typeof usersPaginationSchema>