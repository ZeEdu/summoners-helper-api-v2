import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RunesDto } from './guide/runes.dto';
import { ItemDto } from './guide/item.dto';
import { AbilitiesProgressionDto } from './guide/abilities-progression.dto';
import { ThreatDto } from './guide/threat.dto';

export class CreateGuideDto {
  @IsString({ message: 'title deve ser uma string' })
  @IsNotEmpty({ message: 'title é obrigatório' })
  title: string;

  @IsMongoId({ message: 'createdBy deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'createdBy é obrigatório' })
  createdBy: string;

  @IsString({ message: 'introduction deve ser uma string' })
  @IsNotEmpty({ message: 'introduction é obrigatório' })
  introduction: string;

  @IsString({ message: 'patchVersion deve ser uma string' })
  @IsNotEmpty({ message: 'patchVersion é obrigatório' })
  patchVersion: string;

  @IsString({ message: 'champion deve ser uma string' })
  @IsNotEmpty({ message: 'champion é obrigatório' })
  champion: string;

  @IsString({ message: 'role deve ser uma string' })
  @IsNotEmpty({ message: 'role é obrigatório' })
  role: string;

  // Runes
  @IsNotEmptyObject({}, { message: 'runes é obrigatório' })
  @ValidateNested({ message: 'runes deve ser um objeto válido' })
  @Type(() => RunesDto)
  runes: RunesDto;

  @IsString({ message: 'runesDescription deve ser uma string' })
  @IsNotEmpty({ message: 'runesDescription é obrigatório' })
  runesDescription: string;

  // Bonus
  @IsString({ message: 'bonusSlotOne deve ser uma string' })
  @IsNotEmpty({ message: 'bonusSlotOne é obrigatório' })
  bonusSlotOne: string;

  @IsString({ message: 'bonusSlotTwo deve ser uma string' })
  @IsNotEmpty({ message: 'bonusSlotTwo é obrigatório' })
  bonusSlotTwo: string;

  @IsString({ message: 'bonusSlotThree deve ser uma string' })
  @IsNotEmpty({ message: 'bonusSlotThree é obrigatório' })
  bonusSlotThree: string;

  @IsString({ message: 'bonusDescription deve ser uma string' })
  @IsNotEmpty({ message: 'bonusDescription é obrigatório' })
  bonusDescription: string;

  // Spells
  @IsString({ message: 'firstSpell deve ser uma string' })
  @IsNotEmpty({ message: 'firstSpell é obrigatório' })
  firstSpell: string;

  @IsString({ message: 'secondSpell deve ser uma string' })
  @IsNotEmpty({ message: 'secondSpell é obrigatório' })
  secondSpell: string;

  @IsString({ message: 'spellsDescription deve ser uma string' })
  @IsNotEmpty({ message: 'spellsDescription é obrigatório' })
  spellsDescription: string;

  // Items
  @IsArray({ message: 'itemsBlock deve ser um array' })
  @ArrayMinSize(1, { message: 'itemsBlock deve conter ao menos 1 item' })
  @ValidateNested({ each: true, message: 'itemsBlock contém um item inválido' })
  @Type(() => ItemDto)
  itemsBlock: ItemDto[];

  @IsString({ message: 'itemsDescription deve ser uma string' })
  @IsNotEmpty({ message: 'itemsDescription é obrigatório' })
  itemsDescription: string;

  // Abilities Progression
  @IsNotEmptyObject({}, { message: 'abilitiesProgression é obrigatório' })
  @ValidateNested({ message: 'abilitiesProgression deve ser um objeto válido' })
  @Type(() => AbilitiesProgressionDto)
  abilitiesProgression: AbilitiesProgressionDto;

  @IsString({ message: 'abilitiesProgressionDescription deve ser uma string' })
  @IsNotEmpty({ message: 'abilitiesProgressionDescription é obrigatório' })
  abilitiesProgressionDescription: string;

  @IsArray({ message: 'threats deve ser um array' })
  @ArrayMinSize(1, { message: 'threats deve conter ao menos 1 item' })
  @ValidateNested({ each: true, message: 'threats contém um item inválido' })
  @Type(() => ThreatDto)
  threats: ThreatDto[];
}
