import z from 'zod';

import { AbilityOption } from '../../enums';

export const enumAbilitiesOption = z.enum(AbilityOption, {
  error: `Valor invalido. Deve ser um dos seguintes valores: ${AbilityOption.A},${AbilityOption.B},${AbilityOption.C} ou ${AbilityOption.D}`,
});

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
});

// TODO: TENTAR SE LIVRAR DISSO DAQUI E FAZER APENAS UM ARRAY DE STRING
// export const itemSchema = z.object({
//   itemId: z.string({ error: 'formato do campo é inválido' }),
// });

export const itemsSchema = z.object({
  rowName: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  itemsList: z
    .array(z.string({ error: 'formato do campo é inválido' }))
    .min(1, { error: 'Campo obrigatório' }),
  description: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
});

export const GuideSchemaShape = z.object({
  patchVersion: z.string({ error: 'formato do campo é inválido' }),
  createdAt: z.string({ error: 'formato do campo é inválido' }),
  createdBy: z.string({ error: 'formato do campo é inválido' }),

  title: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  introduction: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  champion: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  role: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),

  // Bonus
  bonusSlotOne: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  bonusSlotTwo: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  bonusSlotThree: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  bonusDescription: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),

  primaryRune: z.string({ error: 'formato do campo é inválido' }),
  primarySlots: z.object({
    first: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
    second: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
    third: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
    fourth: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
  }),
  primaryRuneDescription: z.string({ error: 'formato do campo é inválido' }),

  secondaryRune: z.string({ error: 'formato do campo é inválido' }),
  secondarySlots: z.object({
    first: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
    second: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
    third: z
      .string({ error: 'formato do campo é inválido' })
      .min(1, { error: 'Campo obrigatório' }),
  }),
  secondaryRuneDescription: z.string({ error: 'formato do campo é inválido' }),

  // Spells
  firstSpell: z.string({ error: 'formato do campo é inválido' }),
  secondSpell: z.string({ error: 'formato do campo é inválido' }),
  spellsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Items
  items: z.array(itemsSchema),
  itemsDescription: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,
  abilitiesProgressionDescription: z.string({
    error: 'formato do campo é inválido',
  }),

  threatsDescription: z
    .string({ error: 'formato do campo é inválido' })
    .min(1, { error: 'Campo obrigatório' }),
  threats: z.array(
    z.object({
      threat: z
        .string({ error: 'formato do campo é inválido' })
        .min(1, { error: 'Campo obrigatório' }),
      description: z
        .string({ error: 'formato do campo é inválido' })
        .min(1, { error: 'Campo obrigatório' }),
    }),
  ),
});