import { Types } from 'mongoose';
import { RIOT_SERVERS } from '@org/shared-constants';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  refreshToken?: string;
  gameName?: string;
  tagLine?: string;
  server?: RIOT_SERVERS;
  puuid?: string;
}
