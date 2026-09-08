import z from 'zod';
import { itemArraySchema } from './item-array.dto';

export const itemSchema = z.object({
  itemRollName: z.string({ error: 'formato do campo é inválido' }),
  itemArray: z.array(itemArraySchema)
})
