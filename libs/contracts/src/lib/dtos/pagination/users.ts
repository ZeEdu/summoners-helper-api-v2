import z from "zod";
import { paginationSchema } from "./pagination";

export const usersPaginationSchema = paginationSchema.safeExtend({
  username: z.string({ error: 'O campo deve ser uma string' }).optional(),
  email: z.string({ error: 'O campo deve ser uma string' }).optional(),
})

export type UsersPaginationDto = z.infer<typeof usersPaginationSchema>