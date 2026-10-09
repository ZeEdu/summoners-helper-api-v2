import { Types } from "mongoose";
import { PopulatedGuideDto, UserDto } from "../types";

export interface IComment {
  _id: Types.ObjectId;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  replyTo?: Types.ObjectId;
  content?: string;
  guide: Types.ObjectId;
  removed: boolean;
  removedAt?: Date;
  likeCount: number;
  liked?: boolean // Não deve ser um campo no schema, é uma logica feita manualmente após a query
}

export interface ISerializedComment extends Omit<IComment, '_id' | 'createdBy' | 'replyTo' | 'guide'> {
  id: string,
  createdBy?: UserDto | Types.ObjectId,
  replyTo?: ISerializedComment | Types.ObjectId,
  guide: PopulatedGuideDto | Types.ObjectId
}