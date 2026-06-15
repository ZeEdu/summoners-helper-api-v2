import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../app.module';
import cookieParser from 'cookie-parser';
import request = require('supertest');
import { Model } from 'mongoose';
import { IUser, User, UserDocument } from '../schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { faker } from '@faker-js/faker';

import * as argon from 'argon2';
import { UserPaginationDto } from '../user.pagination.dto';

describe('UsersController', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let accessToken: string;

  async function createUsers(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const password = await argon.hash(faker.internet.password());

      const user: CreateUserDto = {
        username: faker.string.alpha(16),
        password: password,
        email: faker.internet.email(),
      };

      await userModel.create(user);
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.deleteMany();

    await createUsers(25);

    const createUserDto: CreateUserDto = {
      username: faker.string.alpha(16),
      password: faker.internet.password({ prefix: '1!Ab' }),
      email: faker.internet.email(),
    };

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto);

    accessToken = body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('get', () => {
    it('GET /users → should return user filtered by username ', async () => {
      const firstUser = await userModel.findOne().lean<IUser>();

      const pagination: UserPaginationDto = {
        limit: 5,
        username: firstUser.username,
      };

      await request(app.getHttpServer())
        .get('/users')
        .query(pagination)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.count).toBe(1);
          expect(body.users.length).toBe(1);
          expect(body.users[0].username).toBe(firstUser.username);
        });
    });
  });
});
