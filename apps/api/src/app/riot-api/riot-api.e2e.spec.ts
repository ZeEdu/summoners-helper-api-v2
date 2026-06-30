import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import cookieParser = require('cookie-parser');
import { IUser, User, UserDocument } from '../users/schema/user.schema';
import { AppModule } from '../app.module';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import request = require('supertest');
import { RiotApiService } from './service/riot-api.service';
import { RIOT_SERVERS } from './utils/riot-api.constants';
import { RiotApiFixtures } from '../__fixtures__/riot-api.fixtures';

describe('Riot API (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RiotApiService)
      .useValue(RiotApiFixtures.MockedRiotApiService)
      .compile();

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
      .post('/auth/register')
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

  describe('GET /', () => {
    describe('without accessToken', () => {
      it('should throw an error', async () => {
        await request(app.getHttpServer())
          .get('/riot-api/champion-masteries')
          .expect(401);
      });
    });
    describe('without riot-info', () => {
      it('should throw an error', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        const registerUserResponse = await request(app.getHttpServer())
          .post('/auth/register')
          .send(createUserPayload)
          .expect(201);

        await request(app.getHttpServer())
          .get('/riot-api/champion-masteries')
          .set(
            'Authorization',
            `Bearer ${registerUserResponse.body.accessToken}`,
          )
          .expect(403);
      });
    });
  });

  describe('GET /champion-masteries', () => {
    it('should get champions masteries', async () => {
      const { accessToken } = await registerValidUser();
      await request(app.getHttpServer())
        .get('/riot-api/champion-masteries')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(
            RiotApiFixtures.mocked.service.getChampionsMasteries,
          );
        });
    });
  });

  describe('GET /champion-masteries/by-champion', () => {
    it('should get champions masteries by champion', async () => {
      const { accessToken } = await registerValidUser();
      await request(app.getHttpServer())
        .get(`/riot-api/champion-masteries/by-champion?championId=312`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(
            RiotApiFixtures.mocked.service.getChampionsMasteriesByChampion,
          );
        });
    });
  });

  describe('GET /champion-masteries/top', () => {
    it('should get champions masteries by top', async () => {
      const { accessToken } = await registerValidUser();
      await request(app.getHttpServer())
        .get(`/riot-api/champion-masteries/top`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(
            RiotApiFixtures.mocked.service.getChampionsMasteriesByTop,
          );
        });
    });
  });

  describe('GET /current-rank', () => {
    it('should get current user rank', async () => {
      const { accessToken } = await registerValidUser();
      await request(app.getHttpServer())
        .get(`/riot-api/current-rank`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(RiotApiFixtures.mocked.service.getRankedStatus);
        });
    });
  });

  describe('GET /last-five-matches', () => {
    it('should get last five matches', async () => {
      const { accessToken } = await registerValidUser();
      await request(app.getHttpServer())
        .get(`/riot-api/last-five-matches`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          const stringifiedMockedResponse = JSON.parse(
            JSON.stringify(RiotApiFixtures.mocked.service.getLastFiveMatches),
          ); // O Nestjs chama o JSON.stringify na responsta o que torna o valores `undefined` em `null`
          expect(body).toEqual(stringifiedMockedResponse);
        });
    });
  });
});
