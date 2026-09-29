import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GUIDE_REPORT_ACTION_TAKEN, GUIDE_REPORT_REASON, GUIDE_REPORT_STATUS, IGuideReport } from "@org/contracts";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema()
export class GuideReport implements IGuideReport {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Guide', required: true })
  guide: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;

  @Prop({ type: String, enum: GUIDE_REPORT_REASON, required: true })
  reason: GUIDE_REPORT_REASON;

  @Prop({ type: String })
  observation: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: String, enum: GUIDE_REPORT_STATUS, default: GUIDE_REPORT_STATUS.OPENED })
  status: GUIDE_REPORT_STATUS;

  @Prop({ type: String, enum: GUIDE_REPORT_ACTION_TAKEN, default: GUIDE_REPORT_ACTION_TAKEN.WAITING })
  actionTaken: GUIDE_REPORT_ACTION_TAKEN
}

export const GuideReportSchema = SchemaFactory.createForClass(GuideReport)

export type GuideReportDocument = HydratedDocument<GuideReport>