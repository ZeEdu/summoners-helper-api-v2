import z from 'zod';
import { ICreateUserDto } from '../types';

export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;

export const createUserSchema = z.object({
  email: z
    .email()
    .min(1),

  username: z
    .string()
    .min(6)
    .max(64),

  password: z
    .string()
    .min(8)
    .max(128)
    .regex(passwordPattern)

}) satisfies z.ZodType<ICreateUserDto>;

export type CreateUserDto = z.infer<typeof createUserSchema>