import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RiotApiService } from '../service/riot-api.service';
import { CurrentUser } from '../../decorators/user.decorator';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { JwtGuard } from '../../guards/jwt.guard';
import { HasRiotInfoGuard } from '../guards/has-riot-info.guard';

@Controller('riot-api')
@UseGuards(JwtGuard, HasRiotInfoGuard)
export class RiotApiController {
  constructor(private readonly riotApiService: RiotApiService) {}

  @Get('champion-masteries')
  getChampionsMasteries(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getChampionsMasteries(user.puuid, user.server);
  }

  @Get('champion-masteries/by-champion/:championId')
  getChampionsMasteriesByChampion(
    @CurrentUser() user: IUserWithPuuid,
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
    @CurrentUser() user: IUserWithPuuid,
    @Query('count', new ParseIntPipe({ optional: true })) count?: number,
  ) {
    return this.riotApiService.getChampionsMasteriesByTop(
      user.puuid,
      count ?? 5,
      user.server,
    );
  }

  @Get('current-rank')
  getRankedStatus(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getRankedStatus(user.puuid, user.server);
  }

  @Get('last-five-matches')
  getLastFiveMatches(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getLastFiveMatches(user.puuid);
  }

  @Get('summoner')
  getSummoner(@CurrentUser() user: IUserWithPuuid) {
    return this.riotApiService.getSummoner(user.puuid, user.server);
  }
}
