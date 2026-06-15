import { Injectable } from '@nestjs/common';
import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { PaginationDto } from '../../pagination/pagination.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  IUser,
  IUserWithPassword,
  SENSIBLE_FIELDS,
  User,
} from '../schema/user.schema';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findOneByEmail(email: User['email']): Promise<IUser | null> {
    return this.userModel.findOne({ email }).lean<IUser>();
  }

  findOneByEmailWithPassword(
    email: User['email'],
  ): Promise<IUserWithPassword | null> {
    return this.userModel
      .findOne({ email })
      .select('+password')
      .lean<IUserWithPassword>();
  }

  findOneByUsername(username: User['username']): Promise<IUser | null> {
    return this.userModel.findOne({ username }).lean<IUser>();
  }

  findOneById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).lean<IUser>();
  }

  async create(user: CreateUserDto): Promise<IUser> {
    const createdUser = await new this.userModel(user).save();
    return createdUser.toJSON();
  }

  update(
    userId: string,
    updatedUserInformation: UpdateUserDto,
    queryOptions?: QueryOptions<User>,
  ) {
    const { returnDocument = 'after' } = queryOptions || {};
    return this.userModel
      .findByIdAndUpdate(userId, updatedUserInformation, {
        ...queryOptions,
        returnDocument,
      })
      .lean<IUser>();
  }

  async getAllUsers(
    filter?: QueryFilter<User>,
    pagination?: PaginationDto,
  ): Promise<{ count: number; users: IUser[] }> {
    const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = pagination || {};
    filter = filter || {};

    const safeFilter = { ...filter };
    SENSIBLE_FIELDS.forEach((field) => delete safeFilter[field]);

    const count = await this.userModel.countDocuments(safeFilter);
    const users = await this.userModel
      .find(safeFilter)
      .limit(limit)
      .skip(offset)
      .lean<IUser[]>();

    return { users, count };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.updateOne({ _id: userId }, { refreshToken });
  }

  async removeRefreshToken(userId: string) {
    await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
  }
}
