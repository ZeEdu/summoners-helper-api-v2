import { runeSlotSchema } from './rune-slots.dto';
import z from 'zod';

export const runeSchema = z.object({
  primaryRune: z.string({ error: 'formato do campo é inválido' }),
  primarySlots: runeSlotSchema,
  secondaryRune: z.string({ error: 'formato do campo é inválido' }),
  secondarySlots: runeSlotSchema
})