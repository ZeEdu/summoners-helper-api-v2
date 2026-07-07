import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ItemArrayDto } from './item-array.dto';

export class ItemDto {
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  itemRollName: string;

  @IsArray({ message: 'itemArray deve ser um array' })
  @ArrayMinSize(1, { message: 'itemArray deve conter ao menos 1 item' })
  @ValidateNested({ each: true, message: 'itemArray contém um item inválido' })
  @Type(() => ItemArrayDto)
  itemArray: ItemArrayDto[];
}
