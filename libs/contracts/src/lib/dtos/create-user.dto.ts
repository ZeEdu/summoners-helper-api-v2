import z from 'zod';
import { ICreateUserDto } from '../types';
import { VALIDATION_ERROR_KEYS } from '../validation/validation';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

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
    .regex(passwordPattern, { error: VALIDATION_ERROR_KEYS.passwordPattern })

}) satisfies z.ZodType<ICreateUserDto>;

export type CreateUserDto = z.infer<typeof createUserSchema>