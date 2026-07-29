import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IRiotApiErrorLogger {
  statusCode: number;
  body: string;
  headers: string;
  url: string;
}

@Schema()
export class RiotApiErrorLogger implements IRiotApiErrorLogger {
  @Prop({ required: true })
  statusCode: number;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  headers: string;

  @Prop({ required: true })
  url: string;
}

export type RiotApiErrorLoggerDocument = HydratedDocument<RiotApiErrorLogger>;

export const RiotApiErrorLoggerSchema =
  SchemaFactory.createForClass(RiotApiErrorLogger);
