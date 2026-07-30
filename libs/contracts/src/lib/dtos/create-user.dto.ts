import z from 'zod'
import { ICreateUserDto } from '../types';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export const createUserSchema = z.object({
  email: z
    .email({ error: 'Email deve ser válido' })
    .min(1, { error: 'Email é obrigátorio' }),

  username: z
    .string({ error: 'Formato inválido' })
    .min(1, { error: 'Nome de usuário é obrigátorio' })
    .min(5, {
      error: 'O nome de usuário deve ter pelo menos 5 caracteres',
    })
    .max(16, {
      error: 'O nome de usuário deve ter no máximo 16 caracteres',
    }),

  password: z
    .string({ error: 'Formato inválido' })
    .min(1, { error: 'Senha é obrigátoria' })
    .min(8, {
      error: 'A senha deve ter no mínimo 8 caracteres',
    })
    .max(64, {
      error: 'A senha deve ter no máximo 64 caracteres',
    })
    .regex(passwordPattern, {
      error:
        'A senha deve ter ao menos uma letra maiúscula, minúscula, número e caracter especial (@, $, !, %, ? ou &)',
    }),
}) satisfies z.ZodType<ICreateUserDto>;

export type CreateUserDto = z.infer<typeof createUserSchema>