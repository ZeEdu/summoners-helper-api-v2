import z from 'zod';

import { AbilityOption } from '../../schema/abilities-progression.schema';

const enumAbilitiesOption = z.enum(AbilityOption, { error: `Valor invalido. Deve ser um dos seguintes valores: ${AbilityOption.A},${AbilityOption.B},${AbilityOption.C} ou ${AbilityOption.D}` })

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