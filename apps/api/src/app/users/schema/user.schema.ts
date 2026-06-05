import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId
  username: string;
  email: string;
  password: string;
}

export type UserDocument = HydratedDocument<User>

@Schema()
export class User implements IUser {
  _id: Types.ObjectId

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User)