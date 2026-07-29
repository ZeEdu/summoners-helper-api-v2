import { PaginationDto } from '../pagination/pagination.dto';
import { IsOptional } from 'class-validator';
import { QueryFilter } from 'mongoose';
import { User } from './schema/user.schema';

export class UserPaginationDto extends PaginationDto {
  @IsOptional()
  username: string;
}

export const createUserPaginationFilter = (
  query: UserPaginationDto,
): QueryFilter<User> => {
  const filter: QueryFilter<User> = {};

  if (query.username) {
    filter.username = { $regex: query.username, $options: 'i' };
  }

  return filter;
};
