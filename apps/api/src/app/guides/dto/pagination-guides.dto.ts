import { GuidePaginationDto } from '@org/contracts';
import { QueryFilter } from 'mongoose';
import { Guide } from '../schema/guide.schema';

const createFilter = (query: GuidePaginationDto): QueryFilter<Guide> => {
  console.log({ query });

  const filter: QueryFilter<Guide> = {};

  if (query.createdBy) {
    filter.createdBy = query.createdBy;
  }

  if (query.title) {
    filter.title = { $regex: query.title, $options: 'i' };
  }

  if (query.champion) {
    filter.champion = query.champion;
  }

  if (query.role) {
    filter.role = query.role;
  }

  return filter;
};

export const GuidesPagination = {
  createFilter,
};