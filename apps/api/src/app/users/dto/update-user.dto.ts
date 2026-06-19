import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  puuid: string;

  @IsString()
  @IsOptional()
  tagLine: string;

  @IsDate()
  @IsOptional()
  gameName: string;
}
