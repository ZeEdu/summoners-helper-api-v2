import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import {
  IChampionMasteryResponse,
  ILastFiveMatchesResponse,
  IRankedStatusResponse,
  IRiotApiService,
  ISummonerResponse
} from '../riot-api/service/riot-api.service';
import { DataDragonTransformerService } from '../ddragon/data-dragon-transformer.service';
import { RiotAccount } from '../riot-api/interfaces/riot-account.interface';
import { getChampionsMasteries } from './champions-masteries';
import { getChampionsMasteriesByChampion } from './get-champions-masteries-by-champion';
import { getChampionsMasteriesByTop } from './get-champions-masteries-by-top';
import { getRankedStatus } from './get-ranked-status';
import { getLastFiveMatches } from './get-last-five-matches';

const userPuuid = faker.string.alphanumeric(78);
const tagLine = faker.string.alphanumeric(5);
const gameName = faker.internet.userName();

const getAccountByRiotId = {
  tagLine,
  gameName,
  puuid: userPuuid,
};

const getSummoner = {
  puuid: userPuuid,
  profileIconId: 6943,
  revisionDate: 1782452605000,
  summonerLevel: 860,
};

const championId = 107;

const api = {
  getAccountByRiotId,
  getSummoner,
  getChampionsMasteries: getChampionsMasteries(userPuuid),
  getChampionsMasteriesByChampion: getChampionsMasteriesByChampion(userPuuid, championId),
  getChampionsMasteriesByTop: getChampionsMasteriesByTop(userPuuid),
  getRankedStatus: getRankedStatus(userPuuid),
  getLastFiveMatches: getLastFiveMatches(userPuuid),
};

class MockedRiotApiServiceClass implements IRiotApiService {
  getSummoner: jest.MockedFunction<IRiotApiService['getSummoner']>;
  getAccountByRiotId: jest.MockedFunction<
    IRiotApiService['getAccountByRiotId']
  >;
  getChampionsMasteries: jest.MockedFunction<
    IRiotApiService['getChampionsMasteries']
  >;
  getChampionsMasteriesByChampion: jest.MockedFunction<
    IRiotApiService['getChampionsMasteriesByChampion']
  >;
  getChampionsMasteriesByTop: jest.MockedFunction<
    IRiotApiService['getChampionsMasteriesByTop']
  >;
  getRankedStatus: jest.MockedFunction<IRiotApiService['getRankedStatus']>;
  getLastFiveMatches: jest.MockedFunction<
    IRiotApiService['getLastFiveMatches']
  >;

  constructor(private readonly transformer: DataDragonTransformerService) {
    this.getSummoner = jest
      .fn<IRiotApiService['getSummoner']>()
      .mockResolvedValue(this.transformer.transformSummoner(api.getSummoner));

    this.getAccountByRiotId = jest
      .fn<IRiotApiService['getAccountByRiotId']>()
      .mockResolvedValue(getAccountByRiotId);

    this.getChampionsMasteries = jest
      .fn<IRiotApiService['getChampionsMasteries']>()
      .mockResolvedValue(
        api.getChampionsMasteries.map(
          this.transformer.transformChampionsMastery,
        ),
      );

    this.getChampionsMasteriesByChampion = jest
      .fn<IRiotApiService['getChampionsMasteriesByChampion']>()
      .mockResolvedValue(
        this.transformer.transformChampionsMastery(
          api.getChampionsMasteriesByChampion,
        ),
      );

    this.getChampionsMasteriesByTop = jest
      .fn<IRiotApiService['getChampionsMasteriesByTop']>()
      .mockResolvedValue(
        api.getChampionsMasteriesByTop.map(
          this.transformer.transformChampionsMastery,
        ),
      );

    this.getRankedStatus = jest
      .fn<IRiotApiService['getRankedStatus']>()
      .mockResolvedValue(
        api.getRankedStatus.map(this.transformer.transformRankedStatus),
      );

    this.getLastFiveMatches = jest
      .fn<IRiotApiService['getLastFiveMatches']>()
      .mockResolvedValue(
        api.getLastFiveMatches.map((match) =>
          this.transformer.transformMatchInfo(match, userPuuid),
        ),
      );
  }
}

export interface IExpectedRiotApiService {
  getAccountByRiotId: RiotAccount;
  getChampionsMasteries: IChampionMasteryResponse[];
  getSummoner: ISummonerResponse;
  getChampionsMasteriesByChampion: IChampionMasteryResponse;
  getChampionsMasteriesByTop: IChampionMasteryResponse[];
  getRankedStatus: IRankedStatusResponse[];
  getLastFiveMatches: ILastFiveMatchesResponse[];
}

const buildExpectedRiotApiService = (
  transformer: DataDragonTransformerService,
): IExpectedRiotApiService => ({
  getSummoner: transformer.transformSummoner(api.getSummoner),
  getAccountByRiotId: getAccountByRiotId,
  getChampionsMasteries: api.getChampionsMasteries.map(
    transformer.transformChampionsMastery,
  ),
  getChampionsMasteriesByChampion: transformer.transformChampionsMastery(
    api.getChampionsMasteriesByChampion,
  ),
  getChampionsMasteriesByTop: api.getChampionsMasteriesByTop.map(
    transformer.transformChampionsMastery,
  ),
  getRankedStatus: api.getRankedStatus.map(transformer.transformRankedStatus),
  getLastFiveMatches: api.getLastFiveMatches.map((match) =>
    transformer.transformMatchInfo(match, userPuuid),
  ),
});

export const RiotApiFixtures = {
  createMockedRiotApiService: (transformer: DataDragonTransformerService) => {
    return new MockedRiotApiServiceClass(transformer);
  },
  buildExpectedRiotApiService,
  mocked: {
    api,
  },
};
