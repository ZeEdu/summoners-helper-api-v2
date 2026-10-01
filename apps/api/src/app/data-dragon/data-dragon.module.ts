import { Module } from '@nestjs/common';
import { DataDragonController } from './controller/data-dragon.controller';
import { DataDragonService } from './service/data-dragon.service';

@Module({
  controllers: [DataDragonController],
  providers: [DataDragonService],
})
export class DataDragonModule { }
