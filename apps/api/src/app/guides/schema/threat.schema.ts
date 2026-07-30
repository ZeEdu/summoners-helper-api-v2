import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IThreat {
  threat: string;
  description: string;
}

@Schema()
export class Threat implements IThreat {
  @Prop({ type: String })
  threat: string;

  @Prop({ type: String })
  description: string;
}

export const ThreatSchema = SchemaFactory.createForClass(Threat);
