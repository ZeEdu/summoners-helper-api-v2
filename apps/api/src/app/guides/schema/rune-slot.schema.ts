import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IRuneSlots {
  first: string;
  second: string;
  third: string;
  fourth?: string;
}

@Schema()
export class RuneSlots implements IRuneSlots {
  @Prop({ type: String, required: true })
  first: string;

  @Prop({ type: String, required: true })
  second: string;

  @Prop({ type: String, required: true })
  third: string;

  @Prop({ type: String })
  fourth: string;
}

export const RuneSlotsSchema = SchemaFactory.createForClass(RuneSlots);
