import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IItemArray, ItemArray, ItemArraySchema } from './item-array.schema';

export interface IItems {
  itemRollName: string;
  itemArray: IItemArray[];
}

@Schema()
export class Items implements IItems {
  @Prop({ type: String, required: true })
  itemRollName: string;

  @Prop([{ type: ItemArraySchema, required: true }])
  itemArray: ItemArray[];
}

export const ItemSchema = SchemaFactory.createForClass(Items);
