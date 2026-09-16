import { Types } from "mongoose";
import { GuideReportReason } from "../enums";

export interface IGuideReport {
  _id: Types.ObjectId;
  guide: Types.ObjectId;
  reportedBy: Types.ObjectId;
  reason: GuideReportReason;
  observation: string;
  createdAt: Date;
}