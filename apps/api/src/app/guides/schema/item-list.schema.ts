import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IItemList } from '@org/contracts';

@Schema()
export class ItemList implements IItemList {
  @Prop({ type: String, required: true })
  itemId: string;
}

export const ItemListSchema = SchemaFactory.createForClass(ItemList)