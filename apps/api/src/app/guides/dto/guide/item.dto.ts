import { itemArraySchema } from './item-array.dto';
import z from 'zod';

export const itemSchema = z.object({
  itemRollName: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  itemArray: z.array(itemArraySchema).nonoptional({ error: 'o campo é obrigatório' })
})
