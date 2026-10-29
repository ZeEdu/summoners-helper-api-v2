import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IReport, REPORT_ACTION_TAKEN, REPORT_REASON, REPORT_STATUS } from "@org/contracts";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema()
export class Report implements IReport {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Guide' })
  guide?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  comment?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;

  @Prop({ type: String, enum: REPORT_REASON, required: true })
  reason: REPORT_REASON;

  @Prop({ type: String })
  observation: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: String, enum: REPORT_STATUS, default: REPORT_STATUS.OPENED })
  status: REPORT_STATUS;

  @Prop({ type: String, enum: REPORT_ACTION_TAKEN, default: REPORT_ACTION_TAKEN.WAITING })
  actionTaken: REPORT_ACTION_TAKEN
}

export const ReportSchema = SchemaFactory.createForClass(Report)

export type ReportDocument = HydratedDocument<Report>