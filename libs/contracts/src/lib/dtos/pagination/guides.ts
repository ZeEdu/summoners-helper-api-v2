import z from 'zod';

import { paginationSchema } from './pagination';

export const guidesPaginationSchema = paginationSchema.safeExtend({
  title: z.string().optional(),
  createdBy: z.string().optional(),
  champion: z.string().optional(),
  role: z.string().optional(),
  patchVersion: z.string().optional(),
});

export type GuidePaginationDto = z.infer<typeof guidesPaginationSchema>;