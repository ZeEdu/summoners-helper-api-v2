import z from 'zod';

import { paginationSchema } from './pagination';

export const guidesPaginationSchema = paginationSchema.safeExtend({
  title: z.string({ error: 'O campo deve ser uma string' }).optional(),
  createdBy: z.string({ error: 'O campo deve ser uma string' }).optional(),
  champion: z.string({ error: 'O campo deve ser uma string' }).optional(),
  role: z.string({ error: 'O campo deve ser uma string' }).optional(),
});

export type GuidePaginationDto = z.infer<typeof guidesPaginationSchema>;