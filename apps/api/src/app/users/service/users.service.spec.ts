import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IUser, User } from '../schema/user.schema';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';

const userModelMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
  find: jest.fn(),
  limit: jest.fn(),
  skip: jest.fn(),
  lean: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModelMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<jest.Mocked<Model<User>>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return null if user not found', async () => {
      model.findOne.mockImplementationOnce(
        () =>
          ({
            lean: jest.fn().mockReturnValue(null),
          }) as any,
      );

      const wrongEmail = faker.internet.email();
      const result = await service.findOneByEmail(wrongEmail);

      expect(result).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ email: wrongEmail });
    });
    it('should return a user', async () => {
      const mockedUser: IUser = {
        _id: new Types.ObjectId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      model.findOne.mockImplementationOnce(
        () =>
          ({
            lean: jest.fn().mockReturnValue(mockedUser),
          }) as any,
      );

      const result = await service.findOneByEmail(mockedUser.email);

      expect(result).toEqual(mockedUser);
      expect(model.findOne).toHaveBeenCalledWith({ email: mockedUser.email });
    });
  });

  describe('findOneByEmailWithPassword', () => {
    it('should return a user with password', async () => {
      const mockedUser: IUser = {
        _id: new Types.ObjectId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      model.findOne.mockImplementationOnce(
        () =>
          ({
            select: () =>
              ({
                lean: jest.fn().mockReturnValue(mockedUser),
              }) as any,
          }) as any,
      );

      const result = await service.findOneByEmailWithPassword(mockedUser.email);

      expect(result).toEqual(mockedUser);
      expect(result.password).toBeDefined();
      expect(model.findOne).toHaveBeenCalledWith({ email: mockedUser.email });
    });
  });

  describe('findOneByUsername', () => {
    it('should return null if user not found', async () => {
      model.findOne.mockImplementationOnce(
        () =>
          ({
            lean: jest.fn().mockReturnValue(null),
          }) as any,
      );

      const wrongUsername = faker.internet.userName();
      const result = await service.findOneByUsername(wrongUsername);

      expect(result).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ username: wrongUsername });
    });
    it('should return a user', async () => {
      const mockedUser: IUser = {
        _id: new Types.ObjectId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      model.findOne.mockImplementationOnce(
        () =>
          ({
            lean: jest.fn().mockReturnValue(mockedUser),
          }) as any,
      );

      const result = await service.findOneByUsername(mockedUser.username);

      expect(result).toEqual(mockedUser);
      expect(model.findOne).toHaveBeenCalledWith({
        username: mockedUser.username,
      });
    });
  });

  describe('findOneById', () => {
    it('should return null if user not found', async () => {
      model.findById.mockImplementationOnce(
        () =>
          ({
            lean: jest.fn().mockReturnValue(null),
          }) as any,
      );

      const wrongObjectId = new Types.ObjectId().toString();
      const result = await service.findOneById(wrongObjectId);

      expect(result).toBeNull();
      expect(model.findById).toHaveBeenCalledWith(wrongObjectId);
    });
    it('should return a user', async () => {
      const mockedUser: IUser = {
        _id: new Types.ObjectId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      model.findById.mockImplementationOnce(
        () =>
          ({
            lean: jest.fn().mockReturnValue(mockedUser),
          }) as any,
      );

      const userId = mockedUser._id.toString();
      const result = await service.findOneById(userId);

      expect(result).toEqual(mockedUser);
      expect(model.findById).toHaveBeenCalledWith(userId);
    });
  });
});
