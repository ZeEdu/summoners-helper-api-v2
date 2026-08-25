import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IItemArray } from '@org/contracts';

@Schema()
export class ItemArray implements IItemArray {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ItemArraySchema = SchemaFactory.createForClass(ItemArray)
