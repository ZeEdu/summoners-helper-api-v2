import { IsNotEmpty, IsString } from 'class-validator';
import { RIOT_SERVERS } from '@org/shared-constants';

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'gameName é obrigatório' })
  gameName: string;

  @IsString()
  @IsNotEmpty({ message: 'tagLine é obrigatório' })
  tagLine: string;

  @IsString()
  @IsNotEmpty({ message: 'tagLine é obrigatório' })
  server: RIOT_SERVERS;
}
