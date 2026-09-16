import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GuideReportReason, IGuide, IGuideReport, IUser } from "@org/contracts";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

export interface IPopulatedGuideReport extends Omit<IGuideReport, 'guide' | 'reportedBy'> {
  guide: IGuide;
  reportedBy: IUser;
}

@Schema()
export class GuideReport implements IGuideReport {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Guide', required: true })
  guide: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;

  @Prop({ type: String, enum: GuideReportReason, required: true })
  reason: GuideReportReason;

  @Prop({ type: String })
  observation: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;
}

export const GuideReportSchema = SchemaFactory.createForClass(GuideReport)

export type GuideReportDocument = HydratedDocument<GuideReport>