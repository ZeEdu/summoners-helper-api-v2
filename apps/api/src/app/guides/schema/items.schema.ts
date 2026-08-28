import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IItems } from '@org/contracts';

import { ItemList } from './item-list.schema';

@Schema()
export class Items implements IItems {
  @Prop({ type: String, required: true })
  rowName: string;

  @Prop([{ type: ItemList, required: true }])
  items: ItemList[];

  @Prop({ type: String, required: true })
  description: string;
}

export const ItemsSchema = SchemaFactory.createForClass(Items);
