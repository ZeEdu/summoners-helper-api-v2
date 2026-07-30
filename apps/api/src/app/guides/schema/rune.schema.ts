import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRuneSlots, RuneSlots, RuneSlotsSchema } from './rune-slot.schema';

export interface IRunes {
  primaryRune: string;
  primarySlots: IRuneSlots;
  secondaryRune: string;
  secondarySlots: IRuneSlots;
}

@Schema()
export class Runes implements IRunes {
  @Prop({ type: String, required: true })
  primaryRune: string;

  @Prop({ type: RuneSlotsSchema, required: true })
  primarySlots: RuneSlots;

  @Prop({ type: String, required: true })
  secondaryRune: string;

  @Prop({ type: RuneSlotsSchema, required: true })
  secondarySlots: RuneSlots;
}

export const RunesSchema = SchemaFactory.createForClass(Runes);
