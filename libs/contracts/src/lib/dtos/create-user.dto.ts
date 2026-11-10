import z from 'zod';
import { ICreateUserDto } from '../types';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]+$/;

export const createUserSchema = z.object({
  email: z
    .email()
    .min(1),

  username: z
    .string()
    .min(6)
    .max(32),

  password: z
    .string()
    .min(8)
    .max(64)
    .regex(passwordPattern)

}) satisfies z.ZodType<ICreateUserDto>;

export type CreateUserDto = z.infer<typeof createUserSchema>