import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../../users/service/users.service';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { IUser, User, UserSchema } from '../../users/schema/user.schema';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { ConfigModule } from '@nestjs/config';

let mongodb: MongoMemoryServer;

describe('AuthController', () => {
  let controller: AuthController;
  let userModel: Model<User>;

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
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: faker.string.alphanumeric(16),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [UsersService, AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('register', () => {
    it('should call authService.register with createUserDto', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      const accessToken = await controller.register(
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
        await controller.register(createUserPayload, getTypedMockedResponse());

        // Tenta criar um novo usuário com o mesmo email
        const alreadyInUseEmailPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: createUserPayload.email,
        };

        // Tenta criar um usuário com o email repetido
        await expect(
          controller.register(
            alreadyInUseEmailPayload,
            getTypedMockedResponse(),
          ),
        ).rejects.toThrow('Email já está sendo utilizado');
      });

      it('username already used', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        // Cria um usuário
        await controller.register(createUserPayload, getTypedMockedResponse());

        // Tenta criar um novo usuário com o mesmo email
        const alreadyInUseEmailPayload: CreateUserDto = {
          username: createUserPayload.username,
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        // Tenta criar um usuário com o email repetido
        await expect(
          controller.register(
            alreadyInUseEmailPayload,
            getTypedMockedResponse(),
          ),
        ).rejects.toThrow('Nome de usuário já está sendo utilizado');
      });

      // it('without email', () => {

      // })
      // it('without password', () => {

      // })
    });

    // it('should return accessToken wrapped in an object', () => { })

    // it('should propagate errors thrown by authService.register', async () => {
    //   const createUserPayload: CreateUserDto = {
    //     username: '112312',
    //     password: 'asdasd',
    //     email: 'qweqwe'
    //   }

    //   const accessToken = await controller.register(createUserPayload)
    // })
  });

  describe('login', () => {
    it('should call authService.login with current user', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      await controller.register(createUserPayload, getTypedMockedResponse());

      const createdUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      expect(createdUser).toBeDefined();

      const { accessToken } = await controller.login(
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

      await controller.register(createUserPayload, getTypedMockedResponse());

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

      // TODO Deve checar se o refreshToken será removido dos cookies

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

      await controller.register(
        createUserPayload,
        mockedResponse as Partial<Response> as Response,
      );

      const createdUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;
      expect(createdUser.refreshToken).toBeDefined();

      expect(rawRefreshToken).toBeDefined();

      await controller.refreshToken(
        { _id: createdUser._id, refreshToken: rawRefreshToken } as IUser,
        getTypedMockedResponse(),
      );

      const updatedUser = (await userModel.findOne({
        email: createUserPayload.email,
      })) as IUser;

      expect(updatedUser.refreshToken).not.toBe(createdUser.refreshToken);
    });
  });
});
