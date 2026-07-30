import { z } from 'zod';
import { RIOT_SERVERS } from '../constants';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export const updateUserSchema = z.object({
  email: z
    .email({ error: 'Email deve ser válido' })
    .optional(),

  username: z
    .string({ error: 'Formato inválido' })
    .min(5, {
      error: 'O nome de usuário deve ter pelo menos 5 caracteres',
    })
    .max(16, {
      error: 'O nome de usuário deve ter no máximo 16 caracteres',
    })
    .optional(),

  password: z
    .string({ error: 'Formato inválido' })
    .min(8, {
      error: 'A senha deve ter no mínimo 8 caracteres',
    })
    .max(64, {
      error: 'A senha deve ter no máximo 64 caracteres',
    })
    .regex(passwordPattern, {
      error:
        'A senha deve ter ao menos uma letra maiúscula, minúscula, número e caracter especial (@, $, !, %, ? ou &)',
    })
    .optional(),

  puuid: z
    .string({ error: 'Formato inválido' })
    .optional(),

  tagLine: z
    .string({ error: 'Formato inválido' })
    .optional(),

  gameName: z
    .string({ error: 'Formato inválido' })
    .optional(),

  server: z
    .enum(RIOT_SERVERS, {
      error: 'Servidor inválido',
    })
    .optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;