import z from 'zod';
import { ICreateUserDto } from '../types';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export const createUserSchema = z.object({
  email: z
    .email()
    .min(1),

  username: z
    .string()
    .min(1)
    .min(5)
    .max(16),

  password: z
    .string()
    .min(1)
    .min(8)
    .max(64)
    .regex(passwordPattern),
}) satisfies z.ZodType<ICreateUserDto>;

export type CreateUserDto = z.infer<typeof createUserSchema>