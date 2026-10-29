import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserDtoWithPuuid } from '@org/contracts';

import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { HasRiotInfoGuard } from '../guards/has-riot-info.guard';
import { RiotApiService } from '../service/riot-api.service';


@Controller('riot-api')
@UseGuards(JwtGuard, HasRiotInfoGuard)
export class RiotApiController {
  constructor(private readonly riotApiService: RiotApiService) { }

  @Get('champion-masteries')
  getChampionsMasteries(@CurrentUser() user: UserDtoWithPuuid) {
    return this.riotApiService.getChampionsMasteries(user.puuid, user.server);
  }

  @Get('champion-masteries/by-champion/:championId')
  getChampionsMasteriesByChampion(
    @CurrentUser() user: UserDtoWithPuuid,
    @Param('championId', ParseIntPipe) championId: number,
  ) {
    return this.riotApiService.getChampionsMasteriesByChampion(
      user.puuid,
      championId,
      user.server,
    );
  }

  @Get('champion-masteries/top')
  getChampionsMasteriesByTop(
    @CurrentUser() user: UserDtoWithPuuid,
    @Query('count', new ParseIntPipe({ optional: true })) count?: number,
  ) {
    return this.riotApiService.getChampionsMasteriesByTop(
      user.puuid,
      count ?? 5,
      user.server,
    );
  }

  @Get('current-rank')
  getRankedStatus(@CurrentUser() user: UserDtoWithPuuid) {
    return this.riotApiService.getRankedStatus(user.puuid, user.server);
  }

  @Get('last-five-matches')
  getLastFiveMatches(@CurrentUser() user: UserDtoWithPuuid) {
    return this.riotApiService.getLastFiveMatches(user.puuid);
  }

  @Get('summoner')
  getSummoner(@CurrentUser() user: UserDtoWithPuuid) {
    return this.riotApiService.getSummoner(user.puuid, user.server);
  }
}
