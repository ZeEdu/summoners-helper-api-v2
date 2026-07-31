import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IItemArray {
  id: string;
  description: string;
}

@Schema()
export class ItemArray implements IItemArray {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ItemArraySchema = SchemaFactory.createForClass(ItemArray)
