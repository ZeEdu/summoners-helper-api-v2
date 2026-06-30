import { Test, TestingModule } from '@nestjs/testing';
import { RiotApiService } from './riot-api.service';
import { ConfigModule } from '@nestjs/config';
import { RIOT_SERVERS } from '../utils/riot-api.constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../users/schema/user.schema';
import {
  RiotApiErrorLogger,
  RiotApiErrorLoggerSchema,
} from '../schema/riot-api-error-logger.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RiotApiModule } from '../riot-api.module';

let mongodb: MongoMemoryServer;

xdescribe('RiotApiService', () => {
  let service: RiotApiService;

  const tagLine = 'TTV1';
  const gameName = 'MunchyPunchyLOL';

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: RiotApiErrorLogger.name, schema: RiotApiErrorLoggerSchema },
        ]),
        ConfigModule.forRoot({ isGlobal: true }),
        RiotApiModule,
      ],
    }).compile();

    service = module.get<RiotApiService>(RiotApiService);
  });

  xdescribe('getRiotAccount', () => {
    describe('success', () => {
      it('should get riot account info', async () => {
        const result = await service.getAccountByRiotId(gameName, tagLine);

        expect(result).toHaveProperty('puuid');
        expect(result.gameName).toBe(gameName);
        expect(result.tagLine).toBe(tagLine);
      });
    });
  });
  xdescribe('getChampionsMastery', () => {
    it('should get champions masteries', async () => {
      const { puuid } = await service.getAccountByRiotId(gameName, tagLine);

      const result = await service.getChampionsMasteries(
        puuid,
        RIOT_SERVERS.NA1,
      );

      for (const championMastery of result) {
        expect(championMastery).toHaveProperty('championId');
        expect(championMastery).toHaveProperty('championLevel');
        expect(championMastery).toHaveProperty('championPoints');
        expect(championMastery).toHaveProperty('lastPlayTime');
        expect(championMastery).toHaveProperty('championPointsSinceLastLevel');
        expect(championMastery).toHaveProperty('championPointsUntilNextLevel');
        expect(championMastery).toHaveProperty('champion');
      }
    });
  });
  describe('getLastFiveMatches', () => {
    it('should get last five matches', async () => {
      const riotAccount = await service.getAccountByRiotId(gameName, tagLine);
      const result = await service.getLastFiveMatches(riotAccount.puuid);
      expect(result).toBeDefined();
    });
  });

  describe('getRankedStatus', () => {
    it('should get ranked status', async () => {
      const riotAccount = await service.getAccountByRiotId(gameName, tagLine);

      const result = await service.getRankedStatus(
        riotAccount.puuid,
        RIOT_SERVERS.NA1,
      );

      expect(result).toBeDefined();
    });
  });
  //
  //   describe('with error', () => {
  //     it('should get a error when entry is not found', async () => {
  //       const puuid = faker.string.alphanumeric(78);
  //       const url = utilService.buildGetChampionMasteryURL(
  //         puuid,
  //         RIOT_SERVERS.BR1,
  //       );
  //
  //       const scope = nock(url)
  //         .get(() => true)
  //         .reply(404, {
  //           status: {
  //             message: `Not found`,
  //             status_code: 404,
  //           },
  //         });
  //
  //       await expect(
  //         service.getChampionsMasteries(puuid, RIOT_SERVERS.BR1),
  //       ).rejects.toThrow(
  //         'Não foi possível buscar os dados do jogador em um provedor externo',
  //       );
  //
  //       scope.done();
  //     });
  //   });
  // });
  // describe('getChampionsMasteriesByChampion', () => {
  //   it('should get champion mastery by champion', async () => {
  //     const puuid = faker.string.alphanumeric(78);
  //     const url = utilService.buildGetChampionMasteryByChampionURL(
  //       puuid,
  //       championId,
  //       RIOT_SERVERS.BR1,
  //     );
  //     const scope = nock(url)
  //       .get(() => true)
  //       .reply(
  //         200,
  //         MockedRiotApiServiceResponses.getChampionsMasteriesByChampion,
  //       );
  //
  //     const spy = jest.spyOn(service, 'getChampionsMasteriesByChampion');
  //     const result = await service.getChampionsMasteriesByChampion(
  //       puuid,
  //       championId,
  //       RIOT_SERVERS.BR1,
  //     );
  //
  //     expect(result).toEqual(
  //       MockedRiotApiServiceResponses.getChampionsMasteriesByChampion,
  //     );
  //     expect(spy).toHaveBeenCalledWith(puuid, championId, RIOT_SERVERS.BR1);
  //
  //     scope.done();
  //   });
  //   describe('with error', () => {
  //     it('should get a error when entry is not found', async () => {
  //       const puuid = faker.string.alphanumeric(78);
  //       const url = utilService.buildGetChampionMasteryByChampionURL(
  //         puuid,
  //         championId,
  //         RIOT_SERVERS.BR1,
  //       );
  //
  //       const scope = nock(url)
  //         .get(() => true)
  //         .reply(404, {
  //           status: {
  //             message: `Not found`,
  //             status_code: 404,
  //           },
  //         });
  //
  //       await expect(
  //         service.getChampionsMasteriesByChampion(
  //           puuid,
  //           championId,
  //           RIOT_SERVERS.BR1,
  //         ),
  //       ).rejects.toThrow(
  //         'Não foi possível buscar os dados do jogador em um provedor externo',
  //       );
  //
  //       scope.done();
  //     });
  //   });
  // });
  // describe('getChampionsMasteriesByTop', () => {
  //   it('should get champion mastery by top usage', async () => {
  //     const puuid = faker.string.alphanumeric(78);
  //     const count = faker.number.int({ max: 100 });
  //     const url = utilService.buildGetChampionMasteryByTopURL(
  //       puuid,
  //       count,
  //       RIOT_SERVERS.BR1,
  //     );
  //     const scope = nock(url)
  //       .get(() => true)
  //       .reply(200, MockedRiotApiServiceResponses.getChampionsMasteriesByTop);
  //
  //     const spy = jest.spyOn(service, 'getChampionsMasteriesByTop');
  //     const result = await service.getChampionsMasteriesByTop(
  //       puuid,
  //       puuid,
  //       count,
  //       RIOT_SERVERS.BR1,
  //     );
  //
  //     expect(result).toEqual(
  //       MockedRiotApiServiceResponses.getChampionsMasteriesByTop,
  //     );
  //     expect(spy).toHaveBeenCalledWith(puuid, count, RIOT_SERVERS.BR1);
  //
  //     scope.done();
  //   });
  //
  //   describe('with error', () => {
  //     it('should get a error when entry is not found', async () => {
  //       const puuid = faker.string.alphanumeric(78);
  //       const count = faker.number.int({ max: 100 });
  //       const url = utilService.buildGetChampionMasteryByTopURL(
  //         puuid,
  //         count,
  //         RIOT_SERVERS.BR1,
  //       );
  //       const scope = nock(url)
  //         .get(() => true)
  //         .reply(404, {
  //           status: {
  //             message: `Not found`,
  //             status_code: 404,
  //           },
  //         });
  //
  //       await expect(
  //         service.getChampionsMasteriesByTop(puuid, count, RIOT_SERVERS.BR1),
  //       ).rejects.toThrow(
  //         'Não foi possível buscar os dados do jogador em um provedor externo',
  //       );
  //
  //       scope.done();
  //     });
  //   });
  // });

  // describe('getLastFiveMatches', () => {
  //   it('should get last five matches', async () => {
  //     const puuid = faker.string.alphanumeric(78);
  //
  //     const matchesIds = [faker.string.alphanumeric(12)];
  //     const scope = nock(
  //       'https://americas.api.riotgames.com/lol/match/v5/matches',
  //     )
  //       .get(`/by-puuid/${puuid}/ids?start=0&count=5`)
  //       .reply(200, [matchesIds])
  //       .get(`/${matchesIds[0]}`)
  //       .reply(200, MockedRiotApiServiceResponses.getLastFiveMatches);
  //
  //     const spy = jest.spyOn(service, 'getLastFiveMatches');
  //     const result = await service.getLastFiveMatches(puuid);
  //
  //     expect(result[0]).toEqual(
  //       MockedRiotApiServiceResponses.getLastFiveMatches,
  //     );
  //     expect(spy).toHaveBeenCalledWith(puuid);
  //
  //     scope.done();
  //   });
  //
  //   describe('with error', () => {
  //     it('should get a error when entry is not found', async () => {
  //       const puuid = faker.string.alphanumeric(78);
  //
  //       const matchesIds = [faker.string.alphanumeric(12)];
  //       const scope = nock(
  //         'https://americas.api.riotgames.com/lol/match/v5/matches',
  //       )
  //         .get(`/by-puuid/${puuid}/ids?start=0&count=5`)
  //         .reply(200, [matchesIds])
  //         .get(`/${matchesIds[0]}`)
  //         .reply(404, {
  //           status: {
  //             message: `Not found`,
  //             status_code: 404,
  //           },
  //         });
  //
  //       await expect(service.getLastFiveMatches(puuid)).rejects.toThrow(
  //         'Não foi possível buscar os dados do jogador em um provedor externo',
  //       );
  //
  //       scope.done();
  //     });
  //   });
  // });
});
