import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ItemArray, ItemArraySchema } from './item-array.schema';

export interface IItems {
  itemRollName: string;
  itemArray: ItemArray[];
}

@Schema()
export class Items implements IItems {
  @Prop({ type: String })
  itemRollName: string;

  @Prop([ItemArraySchema])
  itemArray: ItemArray[];
}

export const ItemSchema = SchemaFactory.createForClass(Items);
