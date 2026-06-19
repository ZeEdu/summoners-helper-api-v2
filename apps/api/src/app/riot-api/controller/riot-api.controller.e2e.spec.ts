import { Test, TestingModule } from '@nestjs/testing';
import { IUser, User, UserDocument } from '../../users/schema/user.schema';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { getModelToken } from '@nestjs/mongoose';

import { AppModule } from '../../app.module';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request = require('supertest');
import { UpdateUserProfileDto } from '../../users/dto/update-user-profile.dto';

describe('RiotApiController', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let accessToken: string;
  let user: IUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.deleteMany();

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

    user = await userModel
      .findOne({ email: createUserDto.email })
      .lean<IUser>();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update with riot info', async () => {
    const updateDto: UpdateUserProfileDto = {
      tagLine: 'TTV1',
      gameName: 'MunchyPunchyLOL',
    };

    await request(app.getHttpServer())
      .patch('/users/update-profile')
      .send(updateDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const updatedUser = await userModel.findById(user._id).select('+puuid');

    expect(updatedUser).toBeDefined();
  });

  xit('should use the middleware', async () => {
    await request(app.getHttpServer())
      .get('/riot-api/champion-mastery')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
