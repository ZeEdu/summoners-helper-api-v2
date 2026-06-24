import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RiotApiService } from '../riot-api/service/riot-api.service';
import { RiotApiUtilsService } from '../riot-api/service/riot-api.utils.service';
import {
  RiotApiErrorLogger,
  RiotApiErrorLoggerSchema,
} from '../riot-api/schema/riot-api-error-logger.schema';
import { RiotApiModule } from '../riot-api/riot-api.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RiotApiModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
