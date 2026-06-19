import { Injectable } from '@nestjs/common';
import { RiotAccount } from '../interfaces/riot-account.interface';
import { RiotApiUtilsService } from './riot-api.utils.service';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { LeagueEntry } from '../interfaces/league-entry.interface';
import { Match } from '../interfaces/match.interface';
import { ChampionMastery } from '../interfaces/champion-mastery.interface';

@Injectable()
export class RiotApiService {
  constructor(private readonly riotApiUtilsService: RiotApiUtilsService) {}
  async getAccountByRiotId(
    gameName: string,
    tagLine: string,
  ): Promise<RiotAccount> {
    if (!gameName || !tagLine) {
      throw new Error('gameName e tagLine são obrigatórios');
    }

    const url = this.riotApiUtilsService.buildGetAccountByRiotIdURL(
      gameName,
      tagLine,
    );
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível encontrar o jogador');
    }

    const json = await response.json();
    return {
      puuid: json.puuid,
      gameName: json.gameName,
      tagLine: json.tagLine,
    };
  }

  async getChampionsMasteries(puuid: IUserWithPuuid['puuid']) {
    const url = this.riotApiUtilsService.buildGetChampionMasteryURL(puuid);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível encontrar os dados do jogador');
    }

    const json = await response.json();
    return json as ChampionMastery[];
  }

  async getChampionsMasteriesByChampion(
    puuid: IUserWithPuuid['puuid'],
    championId: number,
  ) {
    const url = this.riotApiUtilsService.buildGetChampionMasteryByChampionURL(
      puuid,
      championId,
    );
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível encontrar os dados do jogador');
    }

    const json = await response.json();
    return json as ChampionMastery;
  }

  async getChampionsMasteriesByTop(
    puuid: IUserWithPuuid['puuid'],
    count: number,
  ) {
    const url = this.riotApiUtilsService.buildGetChampionMasteryByTopURL(
      puuid,
      count,
    );
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível encontrar os dados do jogador');
    }

    const json = await response.json();
    return json as ChampionMastery[];
  }

  async getRankedStatus(
    puuid: IUserWithPuuid['puuid'],
  ): Promise<LeagueEntry[]> {
    const url = this.riotApiUtilsService.buildGetRankedStatsURL(puuid);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível encontrar os dados do jogador');
    }

    const json = await response.json();
    return json as LeagueEntry[];
  }

  async getLastFiveMatches(puuid: IUserWithPuuid['puuid']) {
    const url = this.riotApiUtilsService.buildGetLastFiveMatchesURL(puuid);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível encontrar os dados do jogador');
    }

    const matchesIdsJson = await response.json();

    const promises = matchesIdsJson.map(async (matchId) => {
      const url = this.riotApiUtilsService.buildGetMatchDetailsURL(matchId);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Não foi possível encontrar os dados do jogador');
      }
      const json = await response.json();
      return json as Match;
    });

    return Promise.all(promises);
  }
}
