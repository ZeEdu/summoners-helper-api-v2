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

export const itemArraySchema = z.object({
  itemId: z.string({ error: 'formato do campo é inválido' }),
})

export const itemSchema = z.object({
  itemRollName: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  itemArray: z.array(itemArraySchema).min(1, { error: 'Campo obrigatório' }),
  description: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
})

export enum SLOT_BONUS {
  ADAPTIVE = 'ADAPTIVE',
  ATTACK_SPEED = 'ATTACK_SPEED',
  HASTE = 'HASTE',
  MOVEMENT_SPEED = 'MOVEMENT_SPEED',
  BONUS_HEALTH = 'BONUS_HEALTH',
  BASE_HEALTH = 'BASE_HEALTH',
  TENACITY = 'TENACITY',
}

export enum SLOT_BONUS_LABELS {
  ADAPTIVE = '9 Adaptive',
  ATTACK_SPEED = '10% Attack Speed',
  HASTE = '8 Ability Haste',
  MOVEMENT_SPEED = '2.5% Movement Speed',
  BONUS_HEALTH = '10 - 180 Bonus Health',
  BASE_HEALTH = '65 Base Health',
  TENACITY = '15% Tenacity/Slow Resist',
}

export const createGuideSchemaShape = z.object({
  patchVersion: z.string({ error: 'formato do campo é inválido' }),

  title: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  introduction: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  champion: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  role: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),

  // runesDescription: z.string({ error: 'formato do campo é inválido' }),
  // runes: runeSchema,

  // Bonus
  bonusSlotOne: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  bonusSlotTwo: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  bonusSlotThree: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  bonusDescription: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),

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

  threatsDescription: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  threats: z.array(
    z.object({
      threat: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
      description: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' })
    })
  ),
  createdAt: z.string({ error: 'formato do campo é inválido' })
})

export const createGuideSchema = createGuideSchemaShape satisfies z.ZodType<IGuide>

export type CreateGuideDto = z.infer<typeof createGuideSchema>