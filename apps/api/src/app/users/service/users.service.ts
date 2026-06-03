import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  findOneByEmail(email: User['email']) {
    return this.userModel.findOne({ email });
  }

  findOneByUsername(username: User['username']) {
    return this.userModel.findOne({ username });
  }

  findOneById(id: string) {
    return this.userModel.findById(id);
  }

  create(user: CreateUserDto) {
    return new this.userModel(user).save();
  }

  update(userId: string, userInformation: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(userId, userInformation);
  }

}
