import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RuneSlotsDto {
  @IsString({ message: 'O campo `first` deve ser uma string' })
  @IsNotEmpty({ message: 'O campo `first` é obrigatório' })
  first: string;

  @IsString({ message: 'O campo `second` deve ser uma string' })
  @IsNotEmpty({ message: 'O campo `second` é obrigatório' })
  second: string;

  @IsString({ message: 'O campo `third` deve ser uma string' })
  @IsNotEmpty({ message: 'O campo `third` é obrigatório' })
  third: string;

  @IsOptional()
  @IsString({ message: 'O campo `fourth` deve ser uma string' })
  fourth?: string;
}
