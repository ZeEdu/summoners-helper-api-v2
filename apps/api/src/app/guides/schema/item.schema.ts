import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IItems } from '@org/contracts';

import { ItemArray, ItemArraySchema } from './item-array.schema';

@Schema()
export class Items implements IItems {
  @Prop({ type: String, required: true })
  itemRollName: string;

  @Prop([{ type: ItemArraySchema, required: true }])
  itemArray: ItemArray[];
}

export const ItemSchema = SchemaFactory.createForClass(Items);
