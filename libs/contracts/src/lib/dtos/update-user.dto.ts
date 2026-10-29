import { z } from 'zod';
import { RIOT_SERVERS } from '../constants';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export const updateUserSchema = z.object({
  email: z
    .email()
    .optional(),

  username: z
    .string()
    .min(5)
    .max(16)
    .optional(),

  password: z
    .string()
    .min(8)
    .max(64)
    .regex(passwordPattern)
    .optional(),

  puuid: z
    .string()
    .optional(),

  tagLine: z
    .string()
    .optional(),

  gameName: z
    .string()
    .optional(),

  server: z
    .enum(RIOT_SERVERS)
    .optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;