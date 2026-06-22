import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RiotApiService } from '../service/riot-api.service';
import { CurrentUser } from '../../decorators/user.decorator';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { JwtGuard } from '../../guards/jwt.guard';
import { HasRiotInfoGuard } from '../guards/has-riot-info.guard';

@Controller('riot-api')
// TODO Adicionar um guard para verificar se o usuário tem os dados basicos da riot vinculado
@UseGuards(JwtGuard, HasRiotInfoGuard)
export class RiotApiController {
  constructor(private readonly riotApiService: RiotApiService) {}
  @Get('champion-masteries')
  async getChampionsMasteries(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getChampionsMasteries(user.puuid, user.server);
  }

  @Get('champion-masteries/by-champion')
  async getChampionsMasteriesByChampion(
    @CurrentUser() user: IUserWithPuuid,
    @Query('championId') championId: number,
  ) {
    return this.riotApiService.getChampionsMasteriesByChampion(
      user.puuid,
      championId,
      user.server,
    );
  }

  @Get('champion-masteries/top')
  async getChampionsMasteriesByTop(
    @CurrentUser() user: IUserWithPuuid,
    @Query('count') count: number,
  ) {
    return this.riotApiService.getChampionsMasteriesByTop(
      user.puuid,
      count,
      user.server,
    );
  }

  @Get('current-rank')
  getCurrentRank(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getRankedStatus(user.puuid, user.server);
  }

  @Get('last-five-matches')
  getLastFiveMatches(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getLastFiveMatches(user.puuid);
  }
}
