import z from 'zod';

export const runeSlotSchema = z.object({
  first: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  second: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  third: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  fourth: z.string({ error: 'formato do campo é inválido' }).optional(),
})