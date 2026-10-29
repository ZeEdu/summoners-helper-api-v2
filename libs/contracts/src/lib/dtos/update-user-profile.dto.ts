import { z } from 'zod';

import { RIOT_SERVERS } from '../constants';

export const updateUserProfileSchema = z.object({
  gameName: z
    .string()
    .min(1),

  tagLine: z
    .string()
    .min(1),

  server: z.enum(RIOT_SERVERS),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;