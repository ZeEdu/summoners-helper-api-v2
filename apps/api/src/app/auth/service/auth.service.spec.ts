import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/service/users.service';
import { User, UserSchema } from '../../users/schema/user.schema';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../../users/dto/create-user.dto';

import { TestMockUtils } from '../../test.mock.utils';

let mongodb: MongoMemoryServer;

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  describe('validateUser', () => {
    it('should return an user if credentials are valid', async () => {
      const password = faker.internet.password();
      const hashedPassword = await argon2.hash(password);
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedPassword,
      };
      await userModel.create(user);

      const result = await service.validateUser(user.email, password);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
    });
    it('should throw an error if user is not found', async () => {
      const password = faker.internet.password();
      const hashedPassword = await argon2.hash(password);
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedPassword,
      };
      await userModel.create(user);
      await expect(
        service.validateUser(faker.internet.email(), password),
      ).rejects.toThrow('Email ou senha incorretos');
    });
    it('should throw an error if password is incorrect', async () => {
      const password = faker.internet.password();
      const hashedPassword = await argon2.hash(password);
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedPassword,
      };
      await userModel.create(user);
      await expect(
        service.validateUser(user.email, faker.internet.password()),
      ).rejects.toThrow('Email ou senha incorretos');
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };
      const userDocument = await userModel.create(user);
      const result = await service.login(userDocument);
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const updatedUser = await userModel.findById(userDocument._id);
      expect(updatedUser.refreshToken).toBeDefined();
    });
  });

  describe('register', () => {
    it('should register user', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const result = await service.register(user);
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const storedUser = await userModel
        .findOne({ email: user.email })
        .select('+password');

      expect(storedUser).toBeDefined();
      expect(storedUser.refreshToken).toBeDefined();

      const matchPassword = await argon2.verify(
        storedUser.password,
        user.password,
      );
      expect(matchPassword).toBe(true);
    });

    it('should throw an error if email is already in use', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };
      await userModel.create(user);

      const invalidUser: CreateUserDto = {
        email: user.email,
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      await expect(service.register(invalidUser)).rejects.toThrow(
        'Email já está sendo utilizado',
      );
    });

    it('should throw an error if username is already in use', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };
      await userModel.create(user);

      const invalidUser: CreateUserDto = {
        email: faker.internet.email(),
        username: user.username,
        password: faker.internet.password(),
      };

      await expect(service.register(invalidUser)).rejects.toThrow(
        'Nome de usuário já está sendo utilizado',
      );
    });
  });

  describe('refreshToken', () => {
    it('should update the refreshToken', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const registerResult = await service.register(user);

      const storedUser = await userModel.findOne({ email: user.email });

      const refreshTokenResult = await service.refreshToken(
        storedUser._id.toString(),
        registerResult.refreshToken,
      );
      expect(refreshTokenResult).toBeDefined();
      expect(refreshTokenResult.accessToken).toBeDefined();
      expect(refreshTokenResult.refreshToken).toBeDefined();

      expect(refreshTokenResult.refreshToken).not.toBe(
        registerResult.refreshToken,
      );
      expect(refreshTokenResult.accessToken).not.toBe(
        registerResult.accessToken,
      );

      const updatedRefreshTokenUser = await userModel.findOne({
        email: user.email,
      });

      const refreshTokenMatch = await argon2.verify(
        updatedRefreshTokenUser.refreshToken,
        refreshTokenResult.refreshToken,
      );
      expect(refreshTokenMatch).toBe(true);
    });
    it('should throw an error if userId is unknowed', async () => {
      await expect(
        service.refreshToken(
          new Types.ObjectId().toString(),
          TestMockUtils.invalidJwt(),
        ),
      ).rejects.toThrow('Acesso negado');
    });
    it('should throw an error if argument token do not match with the stored token', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      await service.register(user);

      const storedUser = await userModel.findOne({ email: user.email });
      await expect(
        service.refreshToken(
          storedUser._id.toString(),
          TestMockUtils.invalidJwt(),
        ),
      ).rejects.toThrow('Acesso negado');
    });
  });

  describe('logout', () => {
    it('should remove user refreshToken', async () => {
      const user: CreateUserDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      await service.register(user);
      const storedUser = await userModel.findOne({ email: user.email });

      await service.logout(storedUser._id.toString());

      const updateRefreshTokenUser = await userModel.findOne({
        email: user.email,
      });
      expect(updateRefreshTokenUser.refreshToken).toBeNull();
    });
  });
});
