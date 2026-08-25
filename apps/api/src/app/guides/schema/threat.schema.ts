import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IThreat } from '@org/contracts';

@Schema()
export class Threat implements IThreat {
  @Prop({ type: String, required: true })
  threat: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ThreatSchema = SchemaFactory.createForClass(Threat);
