import { GuideSchemaShape } from '@org/contracts';
import z from 'zod';

export const PatchGuideSchema = GuideSchemaShape.omit({
  createdBy: true,
  createdAt: true,
}).extend({
  updatedAt: z.string({ error: 'formato do campo é inválido' }),
});

export type PatchGuideDto = z.infer<typeof PatchGuideSchema>;