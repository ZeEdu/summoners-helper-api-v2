import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { RiotAccount } from '../interfaces/riot-account.interface';
import { RiotApiUtilsService } from './riot-api.utils.service';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { LeagueEntry } from '../interfaces/league-entry.interface';
import { Match, MatchParticipant } from '../interfaces/match.interface';
import { ChampionMastery } from '../interfaces/champion-mastery.interface';
import { RIOT_SERVERS } from '../utils/riot-api.constants';
import {
  IRiotApiErrorLogger,
  RiotApiErrorLogger,
} from '../schema/riot-api-error-logger.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChampionsDataDragonDetails } from '../../ddragon/dto/champion.dto';
import { Summoner } from '../interfaces/summoner.interface';
import { ItemDetails } from '../../ddragon/dto/item.dto';
import { SummonerSpell } from '../../ddragon/dto/spell.dto';
import {
  RunesReforgedDataDragon,
  RunesReforgedSlots,
} from '../../ddragon/dto/runes-reforged-data.dragon';
import { DataDragonTransformer } from '../../ddragon/data-dragon.transform';

interface IChampionMasteryResponse {
  championId: ChampionMastery['championId'];
  championLevel: ChampionMastery['championLevel'];
  championPoints: ChampionMastery['championPoints'];
  lastPlayTime: ChampionMastery['lastPlayTime'];
  championPointsSinceLastLevel: ChampionMastery['championPointsSinceLastLevel'];
  championPointsUntilNextLevel: ChampionMastery['championPointsUntilNextLevel'];
  champion: ChampionsDataDragonDetails['name'];
}

interface ISummonerResponse {
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface ILastFiveMatchesResponse {
  gameDuration: Match['info']['gameDuration'];
  gameMode: Match['info']['gameMode'];
  gameType: Match['info']['gameType'];
  championName: string;
  kills: MatchParticipant['kills'];
  deaths: MatchParticipant['deaths'];
  assists: MatchParticipant['assists'];
  win: MatchParticipant['win'];
  championId: MatchParticipant['championId'];
  teamPosition: MatchParticipant['teamPosition'];
  lane: MatchParticipant['lane'];
  role: MatchParticipant['role'];
  items: ItemDetails[];
  spells: SummonerSpell[];
  mainPerks: {
    style: RunesReforgedDataDragon;
    slots: RunesReforgedSlots[];
  };
  secondaryPerks: {
    style: RunesReforgedDataDragon;
    slots: RunesReforgedSlots[];
  };
}

interface IRankedStatusResponse {
  queueType: LeagueEntry['queueType'];
  tier: LeagueEntry['tier'];
  rank: LeagueEntry['rank'];
  leaguePoints: LeagueEntry['leaguePoints'];
  wins: LeagueEntry['wins'];
  losses: LeagueEntry['losses'];
  hotStreak: LeagueEntry['hotStreak'];
}

export interface IRiotApiService {
  getAccountByRiotId: (
    gameName: IUserWithPuuid['gameName'],
    tagLine: IUserWithPuuid['tagLine'],
  ) => Promise<RiotAccount>;

  getChampionsMasteries: (
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ) => Promise<IChampionMasteryResponse[]>;

  getSummoner: (
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ) => Promise<ISummonerResponse>;

  getChampionsMasteriesByChampion: (
    puuid: IUserWithPuuid['puuid'],
    championId: number,
    server: RIOT_SERVERS,
  ) => Promise<IChampionMasteryResponse>;

  getChampionsMasteriesByTop: (
    puuid: IUserWithPuuid['puuid'],
    count: number,
    server: RIOT_SERVERS,
  ) => Promise<IChampionMasteryResponse[]>;

  getRankedStatus: (
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ) => Promise<IRankedStatusResponse[]>;

  getLastFiveMatches: (
    puuid: IUserWithPuuid['puuid'],
  ) => Promise<ILastFiveMatchesResponse[]>;
}

@Injectable()
export class RiotApiService implements IRiotApiService {
  constructor(
    @InjectModel(RiotApiErrorLogger.name)
    private riotApiErrorLoggerModel: Model<RiotApiErrorLogger>,
    private readonly riotApiUtilsService: RiotApiUtilsService,
  ) {}

  async getAccountByRiotId(
    gameName: IUserWithPuuid['gameName'],
    tagLine: IUserWithPuuid['tagLine'],
  ): Promise<RiotAccount> {
    if (!gameName || !tagLine) {
      throw new Error('gameName e tagLine são obrigatórios');
    }

    const url = this.riotApiUtilsService.buildGetAccountByRiotIdURL(
      gameName,
      tagLine,
    );

    const response = await fetch(url);
    return await this.responseHandler<RiotAccount>(response);
  }

  async getChampionsMasteries(
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ): Promise<IChampionMasteryResponse[]> {
    const url = this.riotApiUtilsService.buildGetChampionMasteryURL(
      puuid,
      server,
    );
    const response = await fetch(url);
    const json = await this.responseHandler<ChampionMastery[]>(response);
    return json.map(DataDragonTransformer.transformChampionsMastery);
  }

  async getChampionsMasteriesByChampion(
    puuid: IUserWithPuuid['puuid'],
    championId: number,
    server: RIOT_SERVERS,
  ): Promise<IChampionMasteryResponse> {
    const url = this.riotApiUtilsService.buildGetChampionMasteryByChampionURL(
      puuid,
      championId,
      server,
    );
    const response = await fetch(url);
    const json = await this.responseHandler<ChampionMastery>(response);
    return DataDragonTransformer.transformChampionsMastery(json);
  }

  async getChampionsMasteriesByTop(
    puuid: IUserWithPuuid['puuid'],
    count: number,
    server: RIOT_SERVERS,
  ): Promise<IChampionMasteryResponse[]> {
    const url = this.riotApiUtilsService.buildGetChampionMasteryByTopURL(
      puuid,
      count,
      server,
    );

    const response = await fetch(url);
    const json = await this.responseHandler<ChampionMastery[]>(response);
    return json.map(DataDragonTransformer.transformChampionsMastery);
  }

  async getRankedStatus(
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ): Promise<IRankedStatusResponse[]> {
    const url = this.riotApiUtilsService.buildGetRankedStatsURL(puuid, server);
    const response = await fetch(url);
    const json = await this.responseHandler<LeagueEntry[]>(response);
    return json.map(DataDragonTransformer.transformRankedStatus);
  }

  async getLastFiveMatches(
    puuid: IUserWithPuuid['puuid'],
  ): Promise<ILastFiveMatchesResponse[]> {
    const url = this.riotApiUtilsService.buildGetLastFiveMatchesURL(puuid);
    const response = await fetch(url);
    const matchesIdsJson = await this.responseHandler<string[]>(response);

    const promises = matchesIdsJson.map(async (matchId) => {
      const url = this.riotApiUtilsService.buildGetMatchDetailsURL(matchId);
      const response = await fetch(url);
      const json = await this.responseHandler<Match>(response);
      return DataDragonTransformer.transformMatchInfo(json, puuid);
    });

    return Promise.all(promises);
  }

  async getSummoner(
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ): Promise<ISummonerResponse> {
    const url = this.riotApiUtilsService.buildGetSummonerURL(puuid, server);
    const response = await fetch(url);
    const json = await this.responseHandler<Summoner>(response);
    return DataDragonTransformer.transformSummoner(json);
  }

  private async responseHandler<T>(response: Response): Promise<T> {
    if (response.ok) {
      return (await response.json()) as T;
    }

    const errorLog: IRiotApiErrorLogger = {
      url: response.url,
      statusCode: response.status,
      body: await response.text(),
      headers: JSON.stringify(response.headers),
    };

    await this.riotApiErrorLoggerModel.insertOne(errorLog).catch((err) => {
      console.error('O salvamento do log de erro falhou', err);
    });

    throw new ServiceUnavailableException(
      'Não foi possível buscar os dados do jogador em um provedor externo',
    );
  }
}
