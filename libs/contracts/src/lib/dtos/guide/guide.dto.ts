import z from 'zod';

import { AbilityOption } from '../../enums';

export const enumAbilitiesOption = z.enum(AbilityOption);

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

export const itemSchema = z.object({
  itemId: z.string(),
});

export const itemsSchema = z.object({
  rowName: z
    .string()
    .min(1),
  itemsList: z
    .array(itemSchema)
    .min(1),
  description: z
    .string()
    .min(1),
});

export const GuideSchemaShape = z.object({
  patchVersion: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),

  title: z
    .string()
    .min(1),
  introduction: z
    .string()
    .min(1),
  champion: z
    .string()
    .min(1),
  role: z
    .string()
    .min(1),

  // Bonus
  bonusSlotOne: z
    .string()
    .min(1),
  bonusSlotTwo: z
    .string()
    .min(1),
  bonusSlotThree: z
    .string()
    .min(1),
  bonusDescription: z
    .string()
    .min(1),

  primaryRune: z.string(),
  primarySlots: z.object({
    first: z
      .string()
      .min(1),
    second: z
      .string()
      .min(1),
    third: z
      .string()
      .min(1),
    fourth: z
      .string()
      .min(1),
  }),
  primaryRuneDescription: z.string(),

  secondaryRune: z.string(),
  secondarySlots: z.object({
    first: z
      .string()
      .min(1),
    second: z
      .string()
      .min(1),
    third: z
      .string()
      .min(1),
  }),
  secondaryRuneDescription: z.string(),

  // Spells
  firstSpell: z.string(),
  secondSpell: z.string(),
  spellsDescription: z.string(),

  // Items
  items: z.array(itemsSchema),
  itemsDescription: z
    .string()
    .min(1),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,
  abilitiesProgressionDescription: z.string({
    error: 'formato do campo é inválido',
  }),

  threatsDescription: z
    .string()
    .min(1),
  threats: z.array(
    z.object({
      threat: z
        .string()
        .min(1),
      description: z
        .string()
        .min(1),
    }),
  ),
});

export type CreateGuideDto = z.infer<typeof GuideSchemaShape>;