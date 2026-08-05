import z from 'zod';
import { ILoginUserDto } from '../types';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export const loginUserSchema = z.object({
  email: z
    .email({ error: 'Email deve ser válido' })
    .min(1, { error: 'Email é obrigátorio' }),

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
}) satisfies z.ZodType<ILoginUserDto>;

export type LoginUserDto = z.infer<typeof loginUserSchema>