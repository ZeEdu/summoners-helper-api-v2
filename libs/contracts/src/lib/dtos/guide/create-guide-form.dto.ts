import z from 'zod';

import { GuideSchemaShape } from './guide.dto';

export const CreateGuideFormSchema = GuideSchemaShape.omit({
  patchVersion: true,
  createdAt: true,
  createdBy: true,
});

export type CreateGuideFormDto = z.infer<typeof CreateGuideFormSchema>;