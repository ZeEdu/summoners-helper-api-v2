import { z } from 'zod';

import { RIOT_SERVERS } from '../constants';

export const updateUserProfileSchema = z.object({
  gameName: z
    .string({ error: 'Formato inválido' })
    .min(1, { error: 'gameName é obrigatório' }),

  tagLine: z
    .string({ error: 'Formato inválido' })
    .min(1, { error: 'tagLine é obrigatório' }),

  server: z.enum(RIOT_SERVERS, {
    error: 'Servidor inválido',
  }),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;