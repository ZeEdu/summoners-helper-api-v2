import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IItemArray {
  id: string;
  description: string;
}

@Schema()
export class ItemArray implements IItemArray {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  description: string;
}

export const ItemArraySchema = SchemaFactory.createForClass(ItemArray)
