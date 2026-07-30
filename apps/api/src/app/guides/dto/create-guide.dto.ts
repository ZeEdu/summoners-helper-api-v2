import { runeSchema } from './guide/runes.dto';
import { itemSchema } from './guide/item.dto';
import { abilitiesProgressionSchema } from './guide/abilities-progression.dto';
import { threatSchema } from './guide/threat.dto';
import z from 'zod';

export const createGuideSchema = z.object({
  title: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  createdBy: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  introduction: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  patchVersion: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  champion: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  role: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  runes: runeSchema,

  // Bonus
  bonusSlotOne: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  bonusSlotTwo: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  bonusSlotThree: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  bonusDescription: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),

  // Spells
  firstSpell: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  secondSpell: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  spellsDescription: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),

  // Items
  itemsBlock: z.array(itemSchema),
  itemsDescription: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,

  abilitiesProgressionDescription: z.string({ error: 'formato do campo é inválido' }).nonoptional({ error: 'o campo é obrigatório' }),
  threats: z.array(threatSchema),
})


export type CreateGuideDto = z.infer<typeof createGuideSchema>