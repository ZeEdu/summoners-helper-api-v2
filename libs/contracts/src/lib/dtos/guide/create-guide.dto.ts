import z from 'zod';

import { GuideSchemaShape } from './guide.dto';

export const CreateGuideSchema = GuideSchemaShape.omit({
  patchVersion: true,
  createdAt: true,
  createdBy: true,
});

export type CreateGuideDto = z.infer<typeof CreateGuideSchema>;