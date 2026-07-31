import z from 'zod';

export const runeSlotSchema = z.object({
  first: z.string({ error: 'formato do campo é inválido' }),
  second: z.string({ error: 'formato do campo é inválido' }),
  third: z.string({ error: 'formato do campo é inválido' }),
  fourth: z.string({ error: 'formato do campo é inválido' }).optional(),
})