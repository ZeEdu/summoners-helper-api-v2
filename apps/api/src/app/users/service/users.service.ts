import { CreateUserDto, UpdateUserDto, UpdateUserProfileDto } from '@org/shared-libs';
import { Injectable } from '@nestjs/common';
import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  PaginationDto,
} from '../../pagination/pagination.dto';
import {
  IUserWithPassword,
  IUserWithPuuid,
  SENSIBLE_FIELDS,
  User,
} from '../schema/user.schema';
import { RiotApiService } from '../../riot-api/service/riot-api.service';

import { IUser } from '@org/shared-libs';
import { RIOT_SERVERS } from '@org/shared-libs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly riotApiService: RiotApiService,
  ) { }

  findOneByEmail(email: User['email']): Promise<IUser | null> {
    return this.userModel.findOne({ email }).lean<IUser>();
  }

  findOneByEmailWithPuuid(
    email: User['email'],
  ): Promise<IUserWithPuuid | null> {
    return this.userModel
      .findOne({ email })
      .select('+puuid')
      .lean<IUserWithPuuid>();
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
    updatedUserInformation: Partial<UpdateUserDto>,
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

  async updateUserWithRiotData(
    user: IUser,
    updateProfileDto: UpdateUserProfileDto,
  ) {
    const accountData = await this.riotApiService.getAccountByRiotId(
      updateProfileDto.gameName,
      updateProfileDto.tagLine,
    );

    const updateData: UpdateUserDto = {
      puuid: accountData.puuid,
      tagLine: accountData.tagLine,
      gameName: accountData.gameName,
      server: updateProfileDto.server,
    };

    return this.update(user._id.toString(), updateData);
  }

  async getTopMasteries(user: IUserWithPuuid, count: number) {
    return this.riotApiService.getChampionsMasteriesByTop(
      user.puuid,
      count,
      user.server || RIOT_SERVERS.BR1,
    );
  }

  async getLastFiveMatches(user: IUser & { puuid: string }) {
    const matches = await this.riotApiService.getLastFiveMatches(user.puuid);
    console.log({ matches });
    // Queue
    // Match Time
    // Result
    // champion
    // runes
    // Items
    // K/D/A
    const matchInfo = {};

    return Promise.resolve(undefined);
  }
}
