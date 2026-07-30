import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IThreat {
  threat: string;
  description: string;
}

@Schema()
export class Threat implements IThreat {
  @Prop({ type: String, required: true })
  threat: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ThreatSchema = SchemaFactory.createForClass(Threat);
