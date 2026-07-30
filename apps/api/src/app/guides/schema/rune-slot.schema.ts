import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IRuneSlots {
  first: string;
  second: string;
  third: string;
  fourth?: string;
}

@Schema()
export class RuneSlots implements IRuneSlots {
  @Prop({ type: String })
  first: string;

  @Prop({ type: String })
  second: string;

  @Prop({ type: String })
  third: string;

  @Prop({ type: String })
  fourth?: string;
}

export const RuneSlotsSchema = SchemaFactory.createForClass(RuneSlots);
