import { IsNotEmpty, IsString } from 'class-validator';

export class ThreatDto {
  @IsString({ message: 'O campo "ameaça" deve ser uma string' })
  @IsNotEmpty({ message: 'O campo "ameaça" é obrigatória' })
  threat: string;

  @IsString({ message: 'O campo `Descrição` deve ser uma string' })
  @IsNotEmpty({ message: 'O campo `Descrição` é obrigatório' })
  description: string;
}
