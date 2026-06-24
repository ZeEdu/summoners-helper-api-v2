import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RiotAccount } from '../interfaces/riot-account.interface';
import { RiotApiUtilsService } from './riot-api.utils.service';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { LeagueEntry } from '../interfaces/league-entry.interface';
import { Match } from '../interfaces/match.interface';
import { ChampionMastery } from '../interfaces/champion-mastery.interface';
import { RIOT_SERVERS } from '../utils/riot-api.constants';
import { isProduction } from '../../utils';
import {
  IRiotApiErrorLogger,
  RiotApiErrorLogger,
  RiotApiErrorLoggerSchema,
} from '../schema/riot-api-error-logger.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface IRiotApiService {
  getAccountByRiotId: (
    gameName: IUserWithPuuid['gameName'],
    tagLine: IUserWithPuuid['tagLine'],
  ) => Promise<RiotAccount>;
  getChampionsMasteries: (
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ) => Promise<ChampionMastery[]>;
  getChampionsMasteriesByChampion: (
    puuid: IUserWithPuuid['puuid'],
    championId: number,
    server: RIOT_SERVERS,
  ) => Promise<ChampionMastery>;
  getChampionsMasteriesByTop: (
    puuid: IUserWithPuuid['puuid'],
    count: number,
    server: RIOT_SERVERS,
  ) => Promise<ChampionMastery[]>;
  getRankedStatus: (
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ) => Promise<LeagueEntry[]>;
  getLastFiveMatches: (puuid: IUserWithPuuid['puuid']) => Promise<Match[]>;
}

@Injectable()
export class RiotApiService implements IRiotApiService {
  constructor(
    private readonly riotApiUtilsService: RiotApiUtilsService,
    @InjectModel(RiotApiErrorLogger.name)
    private riotApiErrorLoggerModel: Model<RiotApiErrorLogger>,
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
  ) {
    const url = this.riotApiUtilsService.buildGetChampionMasteryURL(
      puuid,
      server,
    );
    const response = await fetch(url);
    return await this.responseHandler<ChampionMastery[]>(response);
  }

  async getChampionsMasteriesByChampion(
    puuid: IUserWithPuuid['puuid'],
    championId: number,
    server: RIOT_SERVERS,
  ) {
    const url = this.riotApiUtilsService.buildGetChampionMasteryByChampionURL(
      puuid,
      championId,
      server,
    );
    const response = await fetch(url);
    return await this.responseHandler<ChampionMastery>(response);
  }

  async getChampionsMasteriesByTop(
    puuid: IUserWithPuuid['puuid'],
    count: number,
    server: RIOT_SERVERS,
  ) {
    const url = this.riotApiUtilsService.buildGetChampionMasteryByTopURL(
      puuid,
      count,
      server,
    );
    const response = await fetch(url);
    return await this.responseHandler<ChampionMastery[]>(response);
  }

  async getRankedStatus(
    puuid: IUserWithPuuid['puuid'],
    server: RIOT_SERVERS,
  ): Promise<LeagueEntry[]> {
    const url = this.riotApiUtilsService.buildGetRankedStatsURL(puuid, server);
    const response = await fetch(url);
    return await this.responseHandler<LeagueEntry[]>(response);
  }

  async getLastFiveMatches(puuid: IUserWithPuuid['puuid']) {
    const url = this.riotApiUtilsService.buildGetLastFiveMatchesURL(puuid);
    const response = await fetch(url);
    const matchesIdsJson = await this.responseHandler<string[]>(response);

    const promises = matchesIdsJson.map(async (matchId) => {
      const url = this.riotApiUtilsService.buildGetMatchDetailsURL(matchId);
      const response = await fetch(url);
      return await this.responseHandler<Match>(response);
    });

    return Promise.all(promises);
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

    if (!isProduction) {
      await this.riotApiErrorLoggerModel.insertOne(errorLog);
    } else {
      this.riotApiErrorLoggerModel.insertOne(errorLog).catch((err) => {
        console.log('Falhou ao salvar o erro no banco de dados:', err);
      });
    }

    throw new ServiceUnavailableException(
      'Não foi possível buscar os dados do jogador em um provedor externo',
    );
  }
}
