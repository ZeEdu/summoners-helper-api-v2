import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesController } from './controller/guides.controller';
import { Guide, GuideSchema } from './schema/guide.schema';
import { GuidesService } from './service/guides.service';

@Module({
  providers: [GuidesService],
  controllers: [GuidesController],
  imports: [
    MongooseModule.forFeature([{ name: Guide.name, schema: GuideSchema }]),
  ],
  exports: [GuidesService]
})
export class GuidesModule { }
