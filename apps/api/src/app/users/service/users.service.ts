import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';

import {
  CreateUserDto,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  IUser,
  PaginationDto,
  RIOT_SERVERS,
  UpdateUserDto,
  UpdateUserProfileDto,
  UserDto,
  UserDtoWithPassword,
  UserDtoWithPuuid
} from '@org/contracts';

import ResponseMappers from '../../response-mappers';
import { RiotApiService } from '../../riot-api/service/riot-api.service';
import { IUserWithPassword, IUserWithPuuid, SENSIBLE_FIELDS, User } from '../schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly riotApiService: RiotApiService,
  ) { }

  async findOneByEmail(email: User['email']): Promise<UserDto | undefined> {
    const user = await this.userModel.findOne({ email }).lean<IUser>();
    if (user) {
      return ResponseMappers.user(user)
    }
  }

  async findOneByEmailWithPuuid(
    email: User['email'],
  ): Promise<UserDtoWithPuuid | undefined> {
    const user = await this.userModel
      .findOne({ email })
      .select('+puuid')
      .lean<IUserWithPuuid>()

    if (user) {
      return ResponseMappers.userWithPuuid(user)
    }
  }

  async findOneByIdWithPuuid(
    id: string,
  ): Promise<UserDtoWithPuuid | undefined> {
    const user = await this.userModel
      .findById(id)
      .select('+puuid')
      .lean<IUserWithPuuid>()

    if (user) {
      return ResponseMappers.userWithPuuid(user)
    }
  }

  async findOneByEmailWithPassword(
    email: User['email'],
  ): Promise<UserDtoWithPassword | undefined> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .lean<IUserWithPassword>();

    if (user) {
      return ResponseMappers.userWithPassword(user)
    }
  }

  async findOneByUsername(username: User['username']): Promise<UserDto | undefined> {
    const user = await this.userModel.findOne({ username }).lean<IUser>();

    if (user) {
      return ResponseMappers.user(user)
    }
  }

  async findOneById(id: string): Promise<UserDto | undefined> {
    const user = await this.userModel.findById(id).lean<IUser>();

    if (user) {
      return ResponseMappers.user(user)
    }
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const createdUser = await new this.userModel(user).save();
    return ResponseMappers.user(createdUser)
  }

  async update(
    userId: string,
    updatedUserInformation: Partial<UpdateUserDto>,
    queryOptions?: QueryOptions<User>,
  ): Promise<UserDto | undefined> {
    const { returnDocument = 'after' } = queryOptions || {};

    const options = {
      ...queryOptions,
      returnDocument,
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updatedUserInformation, options)
      .lean<IUser>();

    if (updatedUser) {
      return ResponseMappers.user(updatedUser)
    }
  }

  async getAllUsers(
    filter?: QueryFilter<User>,
    pagination?: PaginationDto,
  ): Promise<{ count: number; users: UserDto[] }> {
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

    return { users: users.map(ResponseMappers.user), count };
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

  async getTopMasteries(user: UserDtoWithPuuid, count: number) {
    return this.riotApiService.getChampionsMasteriesByTop(
      user.puuid,
      count,
      user.server || RIOT_SERVERS.br1,
    );
  }

  async getLastFiveMatches(user: UserDtoWithPuuid) {
    return this.riotApiService.getLastFiveMatches(user.puuid);
  }
}
