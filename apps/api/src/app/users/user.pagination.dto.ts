import { UsersPaginationDto } from '@org/contracts';
import { QueryFilter } from 'mongoose';

import { User } from './schema/user.schema';

export const quickSearch = (
  query: UsersPaginationDto,
): QueryFilter<User> => {
  const filter: QueryFilter<User> = {};

  filter.$or = []

  if (query.username) {
    filter.$or.push({
      username: { $regex: query.username, $options: 'i' }
    })
  }

  return filter;
};

const filter = (
  query: UsersPaginationDto,
): QueryFilter<User> => {
  const filter: QueryFilter<User> = {};

  if (query.username) {
    filter.username = { $regex: query.username, $options: 'i' };
  }

  return filter;
};


const UserPagination = {
  filter,
  quickSearch
}

export default UserPagination