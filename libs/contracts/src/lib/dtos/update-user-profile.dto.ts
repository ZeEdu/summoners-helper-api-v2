import { z } from 'zod';

import { RIOT_SERVERS } from '../constants';
import { VALIDATION_ERROR_KEYS } from '../validation/validation';

export const updateUserProfileSchema = z.object({
  gameName: z
    .string()
    .min(1),

  tagLine: z
    .string()
    .min(1),

  server: z.enum(RIOT_SERVERS, { error: VALIDATION_ERROR_KEYS.enum }),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;