import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { User, UserDocument, UserSchema } from '../schema/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  createUserPaginationFilter,
  UserPaginationDto,
} from '../user.pagination.dto';
import { faker } from '@faker-js/faker';

let mongodb: MongoMemoryServer;

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  it('should be defined', async () => {
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
