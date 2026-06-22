import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { RIOT_SERVERS } from '../../riot-api/utils/riot-api.constants';

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

  @IsString()
  @IsOptional()
  server: RIOT_SERVERS;
}
