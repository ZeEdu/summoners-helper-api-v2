import { Module } from '@nestjs/common';
import { RiotApiController } from './controller/riot-api.controller';
import { RiotApiService } from './service/riot-api.service';
import { RiotApiUtilsService } from './service/riot-api.utils.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RiotApiErrorLogger,
  RiotApiErrorLoggerSchema,
} from './schema/riot-api-error-logger.schema';

@Module({
  controllers: [RiotApiController],
  providers: [RiotApiService, RiotApiUtilsService],
  imports: [
    MongooseModule.forFeature([
      { name: RiotApiErrorLogger.name, schema: RiotApiErrorLoggerSchema },
    ]),
  ],
  exports: [RiotApiService, RiotApiUtilsService],
})
export class RiotApiModule {}
