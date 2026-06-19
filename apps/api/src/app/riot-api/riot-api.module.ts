import { Module } from '@nestjs/common';
import { RiotApiController } from './controller/riot-api.controller';
import { RiotApiService } from './service/riot-api.service';
import { RiotApiUtilsService } from './service/riot-api.utils.service';

@Module({
  controllers: [RiotApiController],
  providers: [RiotApiService, RiotApiUtilsService],
  exports: [RiotApiService],
})
export class RiotApiModule {}
