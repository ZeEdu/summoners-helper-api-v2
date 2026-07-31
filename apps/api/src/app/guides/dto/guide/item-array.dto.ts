import z from 'zod';

export const itemArraySchema = z.object({
  id: z.string({ error: 'formato do campo é inválido' }),
  description: z.string({ error: 'formato do campo é inválido' }),
})