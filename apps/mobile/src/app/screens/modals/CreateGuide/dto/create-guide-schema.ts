import z from "zod";

interface IGuide {
  patchVersion: string;
  createdAt: string,

  title: string;
  introduction: string;
  champion: string;
  role: string;

  firstSpell: string,
  secondSpell: string
}

export const runeSchema = z.object({
  primaryRune: z.string({ error: 'formato do campo é inválido' }),
  primarySlots: z.object({
    first: z.string({ error: 'formato do campo é inválido' }),
    second: z.string({ error: 'formato do campo é inválido' }),
    third: z.string({ error: 'formato do campo é inválido' }),
    fourth: z.string({ error: 'formato do campo é inválido' }),
  }),

  secondaryRune: z.string({ error: 'formato do campo é inválido' }),
  secondarySlots: z.object({
    first: z.string({ error: 'formato do campo é inválido' }),
    second: z.string({ error: 'formato do campo é inválido' }),
    third: z.string({ error: 'formato do campo é inválido' }),
  })
})

export enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}


export type Lvls = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
export type LvlKey = `l${Lvls}`

export const keyFromLvlsBuilder = (level: Lvls): LvlKey => {
  return `l${level}`
}

const CHAPIOM_LEVELS = 18

export const lvlsArrayBuilder = () => {
  return Array.from({ length: CHAPIOM_LEVELS }, (_, i) => i + 1) as Array<Lvls>
}

export const enumAbilitiesOption = z.enum(AbilityOption, { error: `Valor invalido. Deve ser um dos seguintes valores: ${AbilityOption.A},${AbilityOption.B},${AbilityOption.C} ou ${AbilityOption.D}` })

export const abilitiesProgressionSchema = z.object({
  l1: enumAbilitiesOption,
  l2: enumAbilitiesOption,
  l3: enumAbilitiesOption,
  l4: enumAbilitiesOption,
  l5: enumAbilitiesOption,
  l6: enumAbilitiesOption,
  l7: enumAbilitiesOption,
  l8: enumAbilitiesOption,
  l9: enumAbilitiesOption,
  l10: enumAbilitiesOption,
  l11: enumAbilitiesOption,
  l12: enumAbilitiesOption,
  l13: enumAbilitiesOption,
  l14: enumAbilitiesOption,
  l15: enumAbilitiesOption,
  l16: enumAbilitiesOption,
  l17: enumAbilitiesOption,
  l18: enumAbilitiesOption,
})

const itemArraySchema = z.object({
  itemId: z.string({ error: 'formato do campo é inválido' }),
})

const itemSchema = z.object({
  itemRollName: z.string({ error: 'formato do campo é inválido' }),
  itemArray: z.array(itemArraySchema),
  description: z.string({ error: 'formato do campo é inválido' }),
})

export const createGuideSchemaShape = z.object({
  patchVersion: z.string({ error: 'formato do campo é inválido' }),

  title: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  introduction: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  champion: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  role: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),

  // runesDescription: z.string({ error: 'formato do campo é inválido' }),
  // runes: runeSchema,

  // Bonus
  bonusSlotOne: z.string({ error: 'formato do campo é inválido' }),
  bonusSlotTwo: z.string({ error: 'formato do campo é inválido' }),
  bonusSlotThree: z.string({ error: 'formato do campo é inválido' }),
  bonusDescription: z.string({ error: 'formato do campo é inválido' }),

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
  itemsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,
  abilitiesProgressionDescription: z.string({ error: 'formato do campo é inválido' }),

  threatsDescription: z.string({ error: 'formato do campo é inválido' }),
  threats: z.array(
    z.object({
      threat: z.string({ error: 'formato do campo é inválido' }),
      description: z.string({ error: 'formato do campo é inválido' })
    })
  ),
  createdAt: z.string({ error: 'formato do campo é inválido' })
})

export const createGuideSchema = createGuideSchemaShape satisfies z.ZodType<IGuide>

export type CreateGuideDto = z.infer<typeof createGuideSchema>