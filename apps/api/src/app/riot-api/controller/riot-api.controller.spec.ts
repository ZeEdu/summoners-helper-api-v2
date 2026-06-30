import { Test, TestingModule } from '@nestjs/testing';
import { RiotApiController } from './riot-api.controller';
import {
  IUserWithPuuid,
  User,
  UserSchema,
} from '../../users/schema/user.schema';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { UsersService } from '../../users/service/users.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('../service/riot-api.service');
import { RiotApiService } from '../service/riot-api.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';

import { RIOT_SERVERS } from '../utils/riot-api.constants';
import { RiotApiFixtures } from '../../__fixtures__/riot-api.fixtures';

let mongodb: MongoMemoryServer;

describe('RiotApiController', () => {
  let controller: RiotApiController;
  let userModel: Model<User>;

  let user: IUserWithPuuid;

  const userDto: CreateUserDto = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const userPuuid = faker.string.alphanumeric(78);
  const tagLine = faker.string.alphanumeric(5);
  const gameName = faker.internet.userName();
  const server = RIOT_SERVERS.BR1;

  const championId = 107;

  let mockedRiotService: jest.Mocked<RiotApiService>;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RiotApiService,
          useValue: RiotApiFixtures.MockedRiotApiService,
        },
      ],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [RiotApiController],
    }).compile();

    controller = module.get<RiotApiController>(RiotApiController);
    mockedRiotService = module.get<jest.Mocked<RiotApiService>>(RiotApiService);
    userModel = module.get<Model<User>>(getModelToken(User.name));

    await userModel.deleteMany();

    const savedUser = await new userModel({
      ...userDto,
      gameName,
      tagLine,
      server,
      puuid: userPuuid,
    }).save();

    user = savedUser.toJSON();
  });

  describe('getChampionsMastery', () => {
    it('should get champions masteries', async () => {
      const result = await controller.getChampionsMasteries(user);
      expect(result).toEqual(
        RiotApiFixtures.mocked.service.getChampionsMasteries,
      );
      expect(mockedRiotService.getChampionsMasteries).toHaveBeenCalledWith(
        user.puuid,
        user.server,
      );
    });
  });
  describe('getChampionsMasteriesByChampion', () => {
    it('should get champion mastery by champion', async () => {
      const result = await controller.getChampionsMasteriesByChampion(
        user,
        championId,
      );
      expect(result).toEqual(
        RiotApiFixtures.mocked.service.getChampionsMasteriesByChampion,
      );
      expect(
        mockedRiotService.getChampionsMasteriesByChampion,
      ).toHaveBeenCalledWith(user.puuid, championId, user.server);
    });
  });
  describe('getChampionsMasteriesByTop', () => {
    it('should get champion mastery by top usage', async () => {
      const count = 5;
      const result = await controller.getChampionsMasteriesByTop(user, count);
      expect(result).toEqual(
        RiotApiFixtures.mocked.service.getChampionsMasteriesByTop,
      );
      expect(mockedRiotService.getChampionsMasteriesByTop).toHaveBeenCalledWith(
        user.puuid,
        count,
        user.server,
      );
    });
  });
  describe('getRankedStatus', () => {
    it('should get ranked status', async () => {
      const result = await controller.getRankedStatus(user);
      expect(result).toEqual(RiotApiFixtures.mocked.service.getRankedStatus);
      expect(mockedRiotService.getRankedStatus).toHaveBeenCalledWith(
        user.puuid,
        user.server,
      );
    });
  });
  describe('getLastFiveMatches', () => {
    it('should get user ranked status', async () => {
      const result = await controller.getLastFiveMatches(user);
      expect(result).toEqual(RiotApiFixtures.mocked.service.getLastFiveMatches);
      expect(mockedRiotService.getLastFiveMatches).toHaveBeenCalledWith(
        user.puuid,
      );
    });
  });
});
