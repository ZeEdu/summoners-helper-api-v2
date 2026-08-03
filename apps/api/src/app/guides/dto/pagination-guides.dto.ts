import z from 'zod';
import { QueryFilter } from 'mongoose';

import { paginationSchema } from '../../pagination/pagination.dto';
import { Guide } from '../schema/guide.schema';

export const guidesPaginationSchema = paginationSchema.safeExtend({
  title: z.string({ error: 'O campo deve ser uma string' }).optional(),
  createdBy: z.string({ error: 'O campo deve ser uma string' }).optional()
})

export type GuidePaginationDto = z.infer<typeof guidesPaginationSchema>

export const createGuidesPaginationFilter = (
  query: GuidePaginationDto,
): QueryFilter<Guide> => {
  const filter: QueryFilter<Guide> = {};

  if (query.createdBy) {
    filter.createdBy = query.createdBy.toString();
  }

  if (query.title) {
    filter.title = { $regex: query.title, $options: 'i' };
  }

  return filter;
};
