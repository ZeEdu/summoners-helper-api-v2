import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { User, UserSchema } from '../schema/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  createUserPaginationFilter,
  UserPaginationDto,
} from '../user.pagination.dto';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import nock from 'nock';
import { RiotApiUtilsService } from '../../riot-api/service/riot-api.utils.service';
import { RIOT_SERVERS } from '../../riot-api/utils/riot-api.constants';
import {
  RiotApiErrorLogger,
  RiotApiErrorLoggerSchema,
} from '../../riot-api/schema/riot-api-error-logger.schema';
import { RiotApiModule } from '../../riot-api/riot-api.module';

let mongodb: MongoMemoryServer;

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let riotApiUtilsService: RiotApiUtilsService;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: RiotApiErrorLogger.name, schema: RiotApiErrorLoggerSchema },
        ]),
        JwtModule.register({
          secret: faker.string.alphanumeric(16),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        RiotApiModule,
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    riotApiUtilsService = module.get<RiotApiUtilsService>(RiotApiUtilsService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  describe('get all', () => {
    it('should be get users', async () => {
      const pagination: UserPaginationDto = {
        offset: 3,
        limit: 15,
        username: faker.internet.displayName(),
      };

      const spy = jest.spyOn(usersService, 'getAllUsers');

      await controller.getAllUsers(pagination);

      const expectedFilter = createUserPaginationFilter(pagination);

      const expectedPagination = {
        offset: pagination.offset,
        limit: pagination.limit,
      };
      expect(spy).toHaveBeenCalledWith(expectedFilter, expectedPagination);
    });
  });

  describe('update-profile', () => {
    it('should update with riot info', async () => {
      const user = await new userModel({
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
      }).save();

      const tagLine = faker.string.alphanumeric(5);
      const gameName = faker.internet.userName();
      const server = RIOT_SERVERS.BR1;
      const puuid = faker.string.alphanumeric(78);

      const url = riotApiUtilsService.buildGetAccountByRiotIdURL(
        gameName,
        tagLine,
      );
      const scope = nock(url)
        .get(() => true)
        .reply(200, {
          tagLine,
          gameName,
          puuid,
        });

      await controller.updateProfile(user, { tagLine, gameName, server });

      const updatedUser = await userModel.findById(user._id).select('+puuid');
      expect(updatedUser).toBeDefined();
      expect(updatedUser.tagLine).toBe(tagLine);
      expect(updatedUser.gameName).toBe(gameName);
      expect(updatedUser.puuid).toBe(puuid);

      scope.done();
    });

    describe('with error', () => {
      describe('with invalid value', () => {
        it('should throw an error', async () => {
          const user = await new userModel({
            email: faker.internet.email(),
            password: faker.internet.password(),
            username: faker.internet.userName(),
          }).save();

          await expect(
            controller.updateProfile(user, {
              tagLine: '',
              gameName: '',
              server: RIOT_SERVERS.BR1,
            }),
          ).rejects.toThrow('gameName e tagLine são obrigatórios');
        });
      });

      describe('with unknown values', () => {
        it('should not find a riot account', async () => {
          const user = await new userModel({
            email: faker.internet.email(),
            password: faker.internet.password(),
            username: faker.internet.userName(),
          }).save();

          const tagLine = faker.string.alphanumeric(5);
          const gameName = faker.internet.userName();
          const server = RIOT_SERVERS.BR1;

          const url = riotApiUtilsService.buildGetAccountByRiotIdURL(
            gameName,
            tagLine,
          );

          const scope = nock(url)
            .get(() => true)
            .reply(404, {
              status: {
                message: `Data not found - No results found for player with riot id ${gameName}#${tagLine}`,
                status_code: 404,
              },
            });

          await expect(
            controller.updateProfile(user, {
              tagLine,
              gameName,
              server,
            }),
          ).rejects.toThrow(
            'Não foi possível buscar os dados do jogador em um provedor externo',
          );

          scope.done();
        });
      });
    });
  });
});
