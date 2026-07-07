import { IsEnum, IsNotEmpty } from 'class-validator';
import { AbilityOption } from '../../schema/guide.schema';

export class AbilitiesProgressionDto {
  @IsNotEmpty({ message: 'l1 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l1 deve ser um dos valores: a, b, c, d' })
  l1: AbilityOption;

  @IsNotEmpty({ message: 'l2 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l2 deve ser um dos valores: a, b, c, d' })
  l2: AbilityOption;

  @IsNotEmpty({ message: 'l3 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l3 deve ser um dos valores: a, b, c, d' })
  l3: AbilityOption;

  @IsNotEmpty({ message: 'l4 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l4 deve ser um dos valores: a, b, c, d' })
  l4: AbilityOption;

  @IsNotEmpty({ message: 'l5 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l5 deve ser um dos valores: a, b, c, d' })
  l5: AbilityOption;

  @IsNotEmpty({ message: 'l6 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l6 deve ser um dos valores: a, b, c, d' })
  l6: AbilityOption;

  @IsNotEmpty({ message: 'l7 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l7 deve ser um dos valores: a, b, c, d' })
  l7: AbilityOption;

  @IsNotEmpty({ message: 'l8 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l8 deve ser um dos valores: a, b, c, d' })
  l8: AbilityOption;

  @IsNotEmpty({ message: 'l9 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l9 deve ser um dos valores: a, b, c, d' })
  l9: AbilityOption;

  @IsNotEmpty({ message: 'l10 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l10 deve ser um dos valores: a, b, c, d' })
  l10: AbilityOption;

  @IsNotEmpty({ message: 'l11 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l11 deve ser um dos valores válidos' })
  l11: AbilityOption;

  @IsNotEmpty({ message: 'l12 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l12 deve ser um dos valores válidos' })
  l12: AbilityOption;

  @IsNotEmpty({ message: 'l13 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l13 deve ser um dos valores válidos' })
  l13: AbilityOption;

  @IsNotEmpty({ message: 'l14 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l14 deve ser um dos valores válidos' })
  l14: AbilityOption;

  @IsNotEmpty({ message: 'l15 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l15 deve ser um dos valores válidos' })
  l15: AbilityOption;

  @IsNotEmpty({ message: 'l16 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l16 deve ser um dos valores válidos' })
  l16: AbilityOption;

  @IsNotEmpty({ message: 'l17 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l17 deve ser um dos valores válidos' })
  l17: AbilityOption;

  @IsNotEmpty({ message: 'l18 é obrigatório' })
  @IsEnum(AbilityOption, { message: 'l18 deve ser um dos valores válidos' })
  l18: AbilityOption;
}
