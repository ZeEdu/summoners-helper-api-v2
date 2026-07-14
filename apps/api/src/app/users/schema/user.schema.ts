import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IUser } from '@org/shared-types';
import { RIOT_SERVERS } from '@org/shared-constants';

export type IUserWithPassword = IUser & { password: string };
export type IUserWithPuuid = IUser & { puuid: string };

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements IUser {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ select: false })
  puuid: string;

  @Prop()
  gameName: string;

  @Prop()
  tagLine: string;

  @Prop({ type: String, enum: RIOT_SERVERS })
  server: RIOT_SERVERS;
}

export const SENSIBLE_FIELDS = ['password', 'refreshToken'];

export const UserSchema = SchemaFactory.createForClass(User);
