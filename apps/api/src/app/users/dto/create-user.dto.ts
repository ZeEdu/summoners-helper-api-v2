import { ICreateUserDto } from '@summoners-helper/shared-types';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%?&]/

export class CreateUserDto implements ICreateUserDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigátorio' })
  email: string;

  @IsString({ message: 'Formato inválido' })
  @IsNotEmpty({ message: 'Nome de usuário é obrigátorio' })
  @MinLength(5, { message: 'O nome de usuário deve ter pelo menos 5 caracteres' })
  @MaxLength(16, { message: 'O nome de usuário deve ter no máximo 16 caracteres' })
  username: string;

  @IsString({ message: 'Formato inválido' })
  @IsNotEmpty({ message: 'Senha é obrigátoria' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @MaxLength(64, { message: 'A senha deve ter no máximo 64 caracteres' })
  @Matches(passwordPattern, {
    message:
      'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
  })
  password: string;
}
