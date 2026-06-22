import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RiotApiService } from '../riot-api/service/riot-api.service';
import { RiotApiUtilsService } from '../riot-api/service/riot-api.utils.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RiotApiService, RiotApiUtilsService],
  exports: [UsersService],
})
export class UsersModule {}
