import { IGuide } from "../interfaces";
import { UserDto } from "./users.types";

export interface GuideDto extends Omit<IGuide, '_id' | 'createdBy'> {
  id: string;
  createdBy: string;
}

export interface PopulatedGuideDto extends Omit<GuideDto, 'createdBy'> {
  createdBy: UserDto;
}