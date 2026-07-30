import z from 'zod';

export const threatSchema = z.object({
  threat: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  description: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' })
})
