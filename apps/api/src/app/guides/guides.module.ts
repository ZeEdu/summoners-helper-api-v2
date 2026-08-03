import { Module } from '@nestjs/common';
import { GuidesService } from './service/guides.service';
import { GuidesController } from './controller/guides.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Guide, GuideSchema } from './schema/guide.schema';

@Module({
  providers: [GuidesService],
  controllers: [GuidesController],
  imports: [
    MongooseModule.forFeature([{ name: Guide.name, schema: GuideSchema }]),
  ],
})
export class GuidesModule {}
