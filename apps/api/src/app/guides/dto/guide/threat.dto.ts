import z from 'zod';

export const threatSchema = z.object({
  threat: z.string({ error: 'formato do campo é inválido' }),
  description: z.string({ error: 'formato do campo é inválido' })
})
