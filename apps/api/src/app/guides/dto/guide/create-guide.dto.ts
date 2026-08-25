import z from 'zod';

import { IGuide } from '@org/contracts';

import { abilitiesProgressionSchema } from './abilities-progression.dto';
import { itemSchema } from './item.dto';

type OmittedFields = '_id' | 'createdBy' | 'createdAt'

interface ICreateGuideDto extends Omit<IGuide, OmittedFields> {
  createdBy: string,
  createdAt: string
}

export const createGuideSchema = z.object({
  // Intro
  title: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  introduction: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  champion: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  role: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),

  patchVersion: z.string({ error: 'formato do campo é inválido' }),
  createdAt: z.string({ error: 'formato do campo é inválido' }),
  createdBy: z.string({ error: 'formato do campo é inválido' }),

  // Bonus
  bonusSlotOne: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  bonusSlotTwo: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  bonusSlotThree: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  bonusDescription: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),

  // Runes
  primaryRune: z.string({ error: 'formato do campo é inválido' }),
  primarySlots: z.object({
    first: z.string({ error: 'formato do campo é inválido' }),
    second: z.string({ error: 'formato do campo é inválido' }),
    third: z.string({ error: 'formato do campo é inválido' }),
    fourth: z.string({ error: 'formato do campo é inválido' }),
  }),
  primaryRuneDescription: z.string({ error: 'formato do campo é inválido' }),

  secondaryRune: z.string({ error: 'formato do campo é inválido' }),
  secondarySlots: z.object({
    first: z.string({ error: 'formato do campo é inválido' }),
    second: z.string({ error: 'formato do campo é inválido' }),
    third: z.string({ error: 'formato do campo é inválido' }),
  }),
  secondaryRuneDescription: z.string({ error: 'formato do campo é inválido' }),

  // Spells
  firstSpell: z.string({ error: 'formato do campo é inválido' }),
  secondSpell: z.string({ error: 'formato do campo é inválido' }),
  spellsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Items
  itemsBlock: z.array(itemSchema),
  itemsDescription: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,
  abilitiesProgressionDescription: z.string({ error: 'formato do campo é inválido' }),

  // Threats
  threatsDescription: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  threats: z.array(
    z.object({
      threat: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
      description: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' })
    })
  )
}) satisfies z.ZodType<ICreateGuideDto>


export type CreateGuideDto = z.infer<typeof createGuideSchema>