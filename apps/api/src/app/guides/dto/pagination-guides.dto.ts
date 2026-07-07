import { PaginationDto } from '../../pagination/pagination.dto';
import { IsOptional } from 'class-validator';
import { QueryFilter, Types } from 'mongoose';
import { Guide } from '../schema/guide.schema';

export class PaginationGuidesDto extends PaginationDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  createdBy?: Types.ObjectId;
}

export const createGuidesPaginationFilter = (
  query: PaginationGuidesDto,
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
