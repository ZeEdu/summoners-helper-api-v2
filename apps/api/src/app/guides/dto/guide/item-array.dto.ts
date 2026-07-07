import { IsNotEmpty, IsString } from 'class-validator';

export class ItemArrayDto {
  @IsString({ message: 'id deve ser uma string' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  id: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatório' })
  description: string;
}
