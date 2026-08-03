import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import cookieParser = require('cookie-parser');
import { User, UserDocument } from '../users/schema/user.schema';
import { AppModule } from '../app.module';
import { faker } from '@faker-js/faker';
import request = require('supertest');
import { RiotApiErrorLogger } from './schema/riot-api-error-logger.schema';
import nock from 'nock';
import { RiotApiUtilsService } from './service/riot-api.utils.service';
import { CreateUserDto, IUser, RIOT_SERVERS } from '@org/contracts';

describe('Riot API errors (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let riotApiErrorLoggerModel: Model<RiotApiErrorLogger>;
  let riotApiUtilsService: RiotApiUtilsService;

  const riotApiErrors = [
    { statusCode: 400, error: 'Bad Request' },
    { statusCode: 401, error: 'Unauthorized' },
    { statusCode: 403, error: 'Forbidden' },
    { statusCode: 404, error: 'Data not found' },
    { statusCode: 405, error: 'Method not allowed' },
    { statusCode: 415, error: 'Unsupported media type' },
    { statusCode: 429, error: 'Rate limit exceeded' },
    { statusCode: 500, error: 'Internal server error' },
    { statusCode: 502, error: 'Bad gateway' },
    { statusCode: 503, error: 'Service unavailable' },
    { statusCode: 504, error: 'Gateway timeout' },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    riotApiErrorLoggerModel = module.get<Model<RiotApiErrorLogger>>(
      getModelToken(RiotApiErrorLogger.name),
    );

    riotApiUtilsService = module.get<RiotApiUtilsService>(RiotApiUtilsService);

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.deleteMany();

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const registerValidUser = async (userOverride?: IUser) => {
    const createUserPayload: CreateUserDto = {
      username: faker.string.alpha(16),
      password: faker.internet.password({ prefix: '1!Ab' }),
      email: faker.internet.email(),
      ...userOverride,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/web/register')
      .send(createUserPayload)
      .expect(201);

    const updateQuery = {
      puuid: faker.string.alphanumeric(78),
      tagLine: faker.string.alphanumeric(5),
      gameName: faker.internet.userName(),
      server: RIOT_SERVERS.BR1,
    };

    const updatedUser = await userModel
      .findOneAndUpdate({ email: createUserPayload.email }, updateQuery, {
        returnDocument: 'after',
      })
      .select('+puuid server');

    return {
      user: updatedUser,
      accessToken: response.body.accessToken,
    };
  };

  for (const riotApiError of riotApiErrors) {
    describe(`${riotApiError.statusCode} - ${riotApiError.error}`, () => {
      describe('GET /champion-masteries', () => {
        it('should log error', async () => {
          await riotApiErrorLoggerModel.deleteMany();

          const { user, accessToken } = await registerValidUser();
          const url = riotApiUtilsService.buildGetChampionMasteryURL(
            user!.puuid,
            user!.server,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(riotApiError.statusCode, {
              status: {
                message: riotApiError.error,
                status_code: riotApiError.statusCode,
              },
            });

          await request(app.getHttpServer())
            .get('/riot-api/champion-masteries')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(503);

          const errorLog = await riotApiErrorLoggerModel.findOne();
          expect(errorLog).toBeDefined();
          expect(errorLog?.statusCode).toBe(riotApiError.statusCode);
          expect(errorLog).toHaveProperty('body');
          expect(errorLog).toHaveProperty('headers');
          expect(errorLog).toHaveProperty('url');

          scope.done();
        });
      });

      describe('GET /champion-masteries/by-champion', () => {
        it('should log error', async () => {
          await riotApiErrorLoggerModel.deleteMany();

          const { user, accessToken } = await registerValidUser();

          const championId = 123;
          const url = riotApiUtilsService.buildGetChampionMasteryByChampionURL(
            user!.puuid,
            championId,
            user!.server,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(riotApiError.statusCode, {
              status: {
                message: riotApiError.error,
                status_code: riotApiError.statusCode,
              },
            });

          await request(app.getHttpServer())
            .get(`/riot-api/champion-masteries/by-champion/${championId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(503);

          const errorLog = await riotApiErrorLoggerModel.findOne();
          expect(errorLog).toBeDefined();
          expect(errorLog?.statusCode).toBe(riotApiError.statusCode);
          expect(errorLog).toHaveProperty('body');
          expect(errorLog).toHaveProperty('headers');
          expect(errorLog).toHaveProperty('url');

          scope.done();
        });
      });

      describe('GET /champion-masteries/top', () => {
        it('should log error', async () => {
          await riotApiErrorLoggerModel.deleteMany();

          const { user, accessToken } = await registerValidUser();

          const url = riotApiUtilsService.buildGetChampionMasteryByTopURL(
            user!.puuid,
            5,
            user!.server,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(riotApiError.statusCode, {
              status: {
                message: riotApiError.error,
                status_code: riotApiError.statusCode,
              },
            });

          await request(app.getHttpServer())
            .get(`/riot-api/champion-masteries/top`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(503);

          const errorLog = await riotApiErrorLoggerModel.findOne();
          expect(errorLog).toBeDefined();
          expect(errorLog?.statusCode).toBe(riotApiError.statusCode);
          expect(errorLog).toHaveProperty('body');
          expect(errorLog).toHaveProperty('headers');
          expect(errorLog).toHaveProperty('url');

          scope.done();
        });
      });

      describe('GET /current-rank', () => {
        it('should log error', async () => {
          await riotApiErrorLoggerModel.deleteMany();

          const { user, accessToken } = await registerValidUser();

          const url = riotApiUtilsService.buildGetRankedStatsURL(
            user!.puuid,
            user!.server,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(riotApiError.statusCode, {
              status: {
                message: riotApiError.error,
                status_code: riotApiError.statusCode,
              },
            });

          await request(app.getHttpServer())
            .get(`/riot-api/current-rank`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(503);

          const errorLog = await riotApiErrorLoggerModel.findOne();
          expect(errorLog).toBeDefined();
          expect(errorLog?.statusCode).toBe(riotApiError.statusCode);
          expect(errorLog).toHaveProperty('body');
          expect(errorLog).toHaveProperty('headers');
          expect(errorLog).toHaveProperty('url');

          scope.done();
        });
      });
      describe('GET /last-five-matches', () => {
        it('should get last five matches', async () => {
          await riotApiErrorLoggerModel.deleteMany();

          const { user, accessToken } = await registerValidUser();

          const url = riotApiUtilsService.buildGetLastFiveMatchesURL(
            user!.puuid,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(riotApiError.statusCode, {
              status: {
                message: riotApiError.error,
                status_code: riotApiError.statusCode,
              },
            });

          await request(app.getHttpServer())
            .get(`/riot-api/last-five-matches`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(503);

          const errorLog = await riotApiErrorLoggerModel.findOne();
          expect(errorLog).toBeDefined();
          expect(errorLog?.statusCode).toBe(riotApiError.statusCode);
          expect(errorLog).toHaveProperty('body');
          expect(errorLog).toHaveProperty('headers');
          expect(errorLog).toHaveProperty('url');

          scope.done();
        });
      });

      describe('GET /summoner', () => {
        it('should log error', async () => {
          await riotApiErrorLoggerModel.deleteMany();

          const { user, accessToken } = await registerValidUser();

          const url = riotApiUtilsService.buildGetSummonerURL(
            user!.puuid,
            user!.server,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(riotApiError.statusCode, {
              status: {
                message: riotApiError.error,
                status_code: riotApiError.statusCode,
              },
            });

          await request(app.getHttpServer())
            .get(`/riot-api/summoner`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(503);

          const errorLog = await riotApiErrorLoggerModel.findOne();
          expect(errorLog).toBeDefined();
          expect(errorLog!.statusCode).toBe(riotApiError.statusCode);
          expect(errorLog).toHaveProperty('body');
          expect(errorLog).toHaveProperty('headers');
          expect(errorLog).toHaveProperty('url');

          scope.done();
        });
      });
    });
  }
});
