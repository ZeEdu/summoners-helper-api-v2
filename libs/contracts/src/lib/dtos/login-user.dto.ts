import z from 'zod';
import { ILoginUserDto } from '../types';
import { VALIDATION_ERROR_KEYS } from '../validation/validation';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export const loginUserSchema = z.object({
  email: z
    .email()
    .min(1),

  password: z
    .string()
    .min(1)
    .min(8)
    .max(64)
    .regex(passwordPattern, { error: VALIDATION_ERROR_KEYS.passwordPattern }),
}) satisfies z.ZodType<ILoginUserDto>;

export type LoginUserDto = z.infer<typeof loginUserSchema>