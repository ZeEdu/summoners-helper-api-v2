import { Types } from "mongoose";
import { GUIDE_REPORT_ACTION_TAKEN, GUIDE_REPORT_REASON, GUIDE_REPORT_STATUS } from "../enums";
import { IUser, PopulatedGuideDto, UserDto } from "../types";
import { IGuide } from "./guide";

export interface IGuideReport {
  _id: Types.ObjectId;
  guide: Types.ObjectId;
  reportedBy: Types.ObjectId;
  reason: GUIDE_REPORT_REASON;
  observation: string;
  createdAt: Date;
  status: GUIDE_REPORT_STATUS;
  actionTaken: GUIDE_REPORT_ACTION_TAKEN;
}

export interface IPopulatedGuideReport extends Omit<IGuideReport, 'guide' | 'reportedBy'> {
  guide: IGuide;
  reportedBy: IUser;
}

export interface IPopulatedGuideReportDto extends Omit<IPopulatedGuideReport, '_id' | 'guide' | 'reportedBy'> {
  id: string;
  guide: PopulatedGuideDto;
  reportedBy: UserDto;
}