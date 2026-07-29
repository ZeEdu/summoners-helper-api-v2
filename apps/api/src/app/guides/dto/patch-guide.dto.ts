import { CreateGuideDto } from './create-guide.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class PatchGuideDto extends PartialType(
  OmitType(CreateGuideDto, ['createdBy']),
) {}
