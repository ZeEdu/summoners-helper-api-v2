import z from 'zod';
import { createGuideSchema } from './create-guide.dto';

export const patchGuideSchema = createGuideSchema.omit({
  createdBy: true,
})

export type PatchGuideDto = z.infer<typeof patchGuideSchema>