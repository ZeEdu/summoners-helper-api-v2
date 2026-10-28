import { Types } from "mongoose";
import { REPORT_ACTION_TAKEN, REPORT_REASON, REPORT_STATUS } from "../enums";
import { IUser, PopulatedGuideDto, UserDto } from "../types";
import { IComment, ISerializedComment } from "./comment";
import { IGuide } from "./guide";

export interface IReport {
  _id: Types.ObjectId;
  guide?: Types.ObjectId;
  comment?: Types.ObjectId;
  reportedBy: Types.ObjectId;
  reason: REPORT_REASON;
  observation: string;
  createdAt: Date;
  status: REPORT_STATUS;
  actionTaken: REPORT_ACTION_TAKEN;
}

export interface IPopulatedReport extends Omit<IReport, 'guide' | 'comment' | 'reportedBy'> {
  guide?: IGuide;
  comment?: IComment;
  reportedBy: IUser;
}

export interface IPopulatedReportDto extends Omit<IPopulatedReport, '_id' | 'guide' | 'comment' | 'reportedBy'> {
  id: string;
  guide?: PopulatedGuideDto;
  comment?: ISerializedComment;
  reportedBy: UserDto;
}