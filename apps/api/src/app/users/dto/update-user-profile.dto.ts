import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'gameName é obrigatório' })
  gameName: string;

  @IsString()
  @IsNotEmpty({ message: 'tagLine é obrigatório' })
  tagLine: string;
}
