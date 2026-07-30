import z from 'zod';

import { runeSchema } from './guide/runes.dto';
import { itemSchema } from './guide/item.dto';
import { abilitiesProgressionSchema } from './guide/abilities-progression.dto';
import { threatSchema } from './guide/threat.dto';
import { IGuide } from '../schema/guide.schema';
import { objectIdSchema } from '../../dto/custom-schemas';


type OmittedFields = '_id' | 'createdBy' | 'createdAt'

interface ICreateGuideDto extends Omit<IGuide, OmittedFields> {
  createdBy: string,
  createdAt: string
}

export const createGuideSchema = z.object({
  title: z.string({ error: 'formato do campo é inválido' }),
  createdBy: objectIdSchema,
  introduction: z.string({ error: 'formato do campo é inválido' }),
  patchVersion: z.string({ error: 'formato do campo é inválido' }),
  champion: z.string({ error: 'formato do campo é inválido' }),
  role: z.string({ error: 'formato do campo é inválido' }),
  runes: runeSchema,
  runesDescription: z.string({ error: 'formato do campo é inválido' }),

  // Bonus
  bonusSlotOne: z.string({ error: 'formato do campo é inválido' }),
  bonusSlotTwo: z.string({ error: 'formato do campo é inválido' }),
  bonusSlotThree: z.string({ error: 'formato do campo é inválido' }),
  bonusDescription: z.string({ error: 'formato do campo é inválido' }),

  // Spells
  firstSpell: z.string({ error: 'formato do campo é inválido' }),
  secondSpell: z.string({ error: 'formato do campo é inválido' }),
  spellsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Items
  itemsBlock: z.array(itemSchema),
  itemsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,
  abilitiesProgressionDescription: z.string({ error: 'formato do campo é inválido' }),

  threatsDescription: z.string({ error: 'formato do campo é inválido' }),
  threats: z.array(threatSchema),
  createdAt: z.string({ error: 'formato do campo é inválido' })
}) satisfies z.ZodType<ICreateGuideDto>


export type CreateGuideDto = z.infer<typeof createGuideSchema>