import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser, User } from '../schema/user.schema';
import { Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../../pagination/pagination.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  findOneByEmail(email: User['email']): Promise<IUser | null> {
    return this.userModel.findOne({ email }).lean<IUser>();
  }

  findOneByEmailWithPassword(email: User['email']): Promise<IUser | null> {
    return this.userModel.findOne({ email }).select('+password').lean<IUser>();
  }

  findOneByUsername(username: User['username']): Promise<IUser | null> {
    return this.userModel.findOne({ username }).lean<IUser>();
  }

  findOneById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).lean<IUser>();
  }

  async create(user: CreateUserDto): Promise<IUser> {
    const createdUser = await new this.userModel(user).save()
    return createdUser.toJSON();
  }

  update(userId: string, userInformation: UpdateUserDto, options: QueryOptions<User>) {
    const { returnDocument = 'after' } = options
    return this.userModel.findByIdAndUpdate(userId, userInformation, { ...options, returnDocument });
  }

  async getAllUsers(pagination: PaginationDto): Promise<{ count: number, users: IUser[] }> {
    const { limit = 10, offset = 0 } = pagination

    const count = await this.userModel.countDocuments()
    const users = await this.userModel.find().limit(limit).skip(offset).lean<IUser[]>()

    return { count, users }
  }

}
