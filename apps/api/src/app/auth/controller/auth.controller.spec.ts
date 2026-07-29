import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../../users/service/users.service';
import { AuthService } from '../service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../users/schema/user.schema';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import {
  RiotApiErrorLogger,
  RiotApiErrorLoggerSchema,
} from '../../riot-api/schema/riot-api-error-logger.schema';
import { RiotApiModule } from '../../riot-api/riot-api.module';
import { I18nModule, I18nService } from 'nestjs-i18n';
import { I18N } from '../../i18n.config';
import { CreateUserDto, IUser } from '@org/contracts';

let mongodb: MongoMemoryServer;

describe('AuthController', () => {
  let controller: AuthController;
  let userModel: Model<User>;
  let i18nService: I18nService;

  const getMockedResponse = () => {
    return {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  };

  const getTypedMockedResponse = () => {
    return {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as Partial<Response> as Response;
  };

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        RiotApiModule,
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: RiotApiErrorLogger.name, schema: RiotApiErrorLoggerSchema },
        ]),
        JwtModule.register({
          secret: faker.string.alphanumeric(16),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        I18nModule.forRoot(I18N.config),
      ],
      providers: [UsersService, AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    i18nService = module.get<I18nService>(I18nService);
  });

  describe('register', () => {
    it('should call authService.register with createUserDto', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      const accessToken = await controller.webRegister(
        createUserPayload,
        getTypedMockedResponse(),
      );

      expect(accessToken).toBeDefined();
      expect(accessToken).toHaveProperty('accessToken');

      const createdUser = await userModel.findOne({
        email: createUserPayload.email,
      });
      expect(createdUser).toBeDefined();
    });

    describe('with error', () => {
      it('email already used', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        // Cria um usuário
        await controller.webRegister(createUserPayload, getTypedMockedResponse());

        // Tenta criar um novo usuário com o mesmo email
        const alreadyInUseEmailPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: createUserPayload.email,
        };

        // Tenta criar um usuário com o email repetido
        const expectedErrorMessage = i18nService.t(
          'auth.errors.register.emailInUse',
        );
        await expect(
          controller.webRegister(
            alreadyInUseEmailPayload,
            getTypedMockedResponse(),
          ),
        ).rejects.toThrow(expectedErrorMessage);
      });

      it('username already used', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        // Cria um usuário
        await controller.webRegister(createUserPayload, getTypedMockedResponse());

        // Tenta criar um novo usuário com o mesmo email
        const alreadyInUseEmailPayload: CreateUserDto = {
          username: createUserPayload.username,
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        // Tenta criar um usuário com o email repetido
        const expectedErrorMessage = i18nService.t(
          'auth.errors.register.usernameInUse',
        );
        await expect(
          controller.webRegister(
            alreadyInUseEmailPayload,
            getTypedMockedResponse(),
          ),
        ).rejects.toThrow(expectedErrorMessage);
      });
    });
  });

  describe('login', () => {
    it('should call authService.login with current user', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      await controller.webRegister(createUserPayload, getTypedMockedResponse());

      const createdUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      expect(createdUser).toBeDefined();

      const { accessToken } = await controller.webLogin(
        createdUser,
        getTypedMockedResponse(),
      );

      // Deve colocar o refreshToken nos cookies da requisição
      expect(accessToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should call authService.logout and remove refreshToken from user', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      await controller.webRegister(createUserPayload, getTypedMockedResponse());

      const createdUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      expect(createdUser.refreshToken).toBeDefined();

      await controller.logout(createdUser, getTypedMockedResponse());

      const updatedUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      expect(updatedUser.refreshToken).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh and update refreshToken from user', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      const mockedResponse = getMockedResponse();
      let rawRefreshToken: string;
      jest.spyOn(mockedResponse, 'cookie').mockImplementation((name, value) => {
        if (name === 'refresh_token') {
          rawRefreshToken = value as string;
        }
        return mockedResponse;
      });

      await controller.webRegister(
        createUserPayload,
        mockedResponse as Partial<Response> as Response,
      );

      const createdUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;
      expect(createdUser.refreshToken).toBeDefined();

      expect(rawRefreshToken!).toBeDefined();

      await controller.webRefreshToken(
        { _id: createdUser._id, refreshToken: rawRefreshToken! } as IUser,
        getTypedMockedResponse(),
      );

      const updatedUser = (await userModel.findOne({
        email: createUserPayload.email,
      })) as IUser;

      expect(updatedUser.refreshToken).not.toBe(createdUser.refreshToken);
    });
  });
});
