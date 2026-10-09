import { Controller, Get, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { DataDragonService } from '../service/data-dragon.service';

const championAssetsSchema = z.object({
  patch: z.string().optional()
})

type ChampionAssetsDto = z.infer<typeof championAssetsSchema>

@Controller('data-dragon')
export class DataDragonController {
  constructor(private dataDragonService: DataDragonService) { }
  @Get('assets')
  getAssets() {
    return this.dataDragonService.getAssets()
  }

  @Get('champion/:championId')
  getChampion(
    @Query(new ZodValidationPipe(championAssetsSchema)) body: ChampionAssetsDto,
    @Param('championId') championId: string) {
    return this.dataDragonService.champion(championId, body.patch)
  }
}
