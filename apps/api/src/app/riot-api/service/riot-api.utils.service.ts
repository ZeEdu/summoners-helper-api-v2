import { Injectable } from '@nestjs/common';
import { isTest } from '../../utils';
import { ConfigService } from '@nestjs/config';
import { RIOT_SERVERS } from '@org/shared-constants';

@Injectable()
export class RiotApiUtilsService {
  private readonly accountBaseURL = `https://americas.api.riotgames.com/riot/account/v1/accounts`;
  private readonly matchBaseURL = `https://americas.api.riotgames.com/lol/match/v5/matches`;
  private readonly summonersBaseURL = `api.riotgames.com/lol/summoner/v4/summoners`;
  private readonly leagueBaseURL = `api.riotgames.com/lol/league/v4`;
  private readonly championMasteryBaseURL = `api.riotgames.com/lol/champion-mastery/v4/champion-masteries`;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow('RIOT_API_KEY');
  }

  buildGetSummonerURL(puuid: string, server: RIOT_SERVERS) {
    const url = `https://${server}.${this.summonersBaseURL}/by-puuid/${puuid}`;
    if (isTest) {
      return url;
    }
    return `${url}?api_key=${this.apiKey}`;
  }

  buildGetAccountByRiotIdURL(gameName: string, tagLine: string) {
    const url = `${this.accountBaseURL}/by-riot-id/${gameName}/${tagLine}`;
    if (isTest) {
      return url;
    }
    return `${url}?api_key=${this.apiKey}`;
  }

  buildGetRankedStatsURL(puuid: string, server: RIOT_SERVERS) {
    const url = `https://${server}.${this.leagueBaseURL}/entries/by-puuid/${puuid}`;
    if (isTest) {
      return url;
    }
    return `${url}?api_key=${this.apiKey}`;
  }

  buildGetLastFiveMatchesURL(puuid: string) {
    const url = `${this.matchBaseURL}/by-puuid/${puuid}/ids?start=0&count=5`;
    if (isTest) {
      return url;
    }
    return `${url}&api_key=${this.apiKey}`;
  }

  buildGetMatchDetailsURL(matchId: string) {
    const url = `${this.matchBaseURL}/${matchId}`;
    if (isTest) {
      return url;
    }
    return `${url}?api_key=${this.apiKey}`;
  }

  buildGetChampionMasteryURL(puuid: string, server: RIOT_SERVERS) {
    const url = `https://${server}.${this.championMasteryBaseURL}/by-puuid/${puuid}`;
    if (isTest) {
      return url;
    }
    return `${url}?api_key=${this.apiKey}`;
  }

  buildGetChampionMasteryByChampionURL(
    puuid: string,
    championId: number,
    server: RIOT_SERVERS,
  ) {
    const url = `https://${server}.${this.championMasteryBaseURL}/by-puuid/${puuid}/by-champion/${championId}`;
    if (isTest) {
      return url;
    }
    return `${url}?api_key=${this.apiKey}`;
  }

  buildGetChampionMasteryByTopURL(
    puuid: string,
    count: number,
    server: RIOT_SERVERS,
  ) {
    const url = `https://${server}.${this.championMasteryBaseURL}/by-puuid/${puuid}?count=${count}`;
    if (isTest) {
      return url;
    }
    return `${url}&api_key=${this.apiKey}`;
  }
}
