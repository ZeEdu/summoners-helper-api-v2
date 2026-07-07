import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RuneSlotsDto } from './rune-slots.dto';

export class RunesDto {
  @IsString({ message: 'O campo `runa primaria` deve ser uma string' })
  @IsNotEmpty({ message: 'O campo `runa primaria` é obrigatório' })
  primaryRune: string;

  @IsNotEmptyObject({}, { message: 'O campo `primarySlots` é obrigatório' })
  @ValidateNested({
    message: 'O campo `primarySlots` deve ser um objeto válido',
  })
  @Type(() => RuneSlotsDto)
  primarySlots: RuneSlotsDto;

  @IsString({
    message: 'O campo `secondaryRune` deve ser uma string',
  })
  @IsNotEmpty({ message: 'O campo `secondaryRune` é obrigatório' })
  secondaryRune: string;

  @IsNotEmptyObject(
    {},
    { message: 'O campo "runas secondárias" é obrigatório' },
  )
  @ValidateNested({
    message: 'O campo "runas secondárias" deve ser um objeto válido',
  })
  @Type(() => RuneSlotsDto)
  secondarySlots: RuneSlotsDto;
}
