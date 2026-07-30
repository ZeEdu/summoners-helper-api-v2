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
  @Prop({ type: String })
  primaryRune: string;

  @Prop({ type: RuneSlotsSchema })
  primarySlots: RuneSlots;

  @Prop({ type: String })
  secondaryRune: string;

  @Prop({ type: RuneSlotsSchema })
  secondarySlots: RuneSlots;
}

export const RunesSchema = SchemaFactory.createForClass(Runes);
