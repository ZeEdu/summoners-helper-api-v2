import { QueryFilter } from 'mongoose';
import z from 'zod';

import { User } from './schema/user.schema';
import { paginationSchema } from '@org/contracts';

export const userPaginationSchema = paginationSchema.safeExtend({
  username: z.string({ error: '' }),
});

export type UserPaginationDto = z.infer<typeof userPaginationSchema>;

export const createUserPaginationFilter = (
  query: UserPaginationDto,
): QueryFilter<User> => {
  const filter: QueryFilter<User> = {};

  if (query.username) {
    filter.username = { $regex: query.username, $options: 'i' };
  }

  return filter;
};
