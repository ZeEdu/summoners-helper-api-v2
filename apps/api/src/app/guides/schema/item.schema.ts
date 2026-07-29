import { Schema, SchemaFactory } from '@nestjs/mongoose';

export interface Items {
  itemRollName: string;
  itemArray: ItemArray[];
}

export interface ItemArray {
  id: string;
  description: string;
}

@Schema()
export class Item implements Items {
  itemRollName: string;
  itemArray: ItemArray[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
