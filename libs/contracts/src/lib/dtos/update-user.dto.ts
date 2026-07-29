import { IsDate, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { RIOT_SERVERS } from '../constants';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/;

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Formato inválido' })
  @MinLength(5, {
    message: 'O nome de usuário deve ter pelo menos 5 caracteres',
  })
  @MaxLength(16, {
    message: 'O nome de usuário deve ter no máximo 16 caracteres',
  })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Formato inválido' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @MaxLength(64, { message: 'A senha deve ter no máximo 64 caracteres' })
  @Matches(passwordPattern, {
    message:
      'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
  })
  @IsOptional()
  password?: string;

  @IsString({ message: 'Formato inválido' })
  @IsOptional()
  puuid?: string;

  @IsString({ message: 'Formato inválido' })
  @IsOptional()
  tagLine?: string;

  @IsDate({ message: 'Formato inválido' })
  @IsOptional()
  gameName?: string;

  @IsString({ message: 'Formato inválido' })
  @IsOptional()
  server?: RIOT_SERVERS;
}
