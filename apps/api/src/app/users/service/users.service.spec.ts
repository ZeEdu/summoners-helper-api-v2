import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, UsersService } from './users.service';
import { IUser, User } from '../schema/user.schema';
import { Model, QueryFilter, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../dto/create-user.dto';
import { TestMockUtils } from '../../test.mock.utils';
import { RIOT_SERVERS } from '../../riot-api/utils/riot-api.constants';
import { RiotApiService } from '../../riot-api/service/riot-api.service';
import { MockedRiotApiService } from '../../__fixtures__/riot-api.fixtures';

describe('UsersService', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<User>>;
  let riotApiService: jest.Mocked<RiotApiService>;

  const mockedUserFields = {
    _id: new Types.ObjectId(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const mockSavedDoc = {
    ...mockedUserFields,
    toJSON: jest.fn().mockReturnValue({
      ...mockedUserFields,
    }),
  };
  const mockDetailModel = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockReturnValue(mockSavedDoc),
  }));

  Object.assign(mockDetailModel, {
    findOne: jest.fn(),
    updateOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
    limit: jest.fn(),
    skip: jest.fn(),
    lean: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockDetailModel },
        { provide: RiotApiService, useValue: MockedRiotApiService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<jest.Mocked<Model<User>>>(getModelToken(User.name));
    riotApiService = module.get<jest.Mocked<RiotApiService>>(RiotApiService);
  });

  describe('findOneByEmail', () => {
    it('should return null if user not found', async () => {
      const mockLean = jest.fn().mockReturnValue(null);
      const mockFindOne = jest.fn().mockReturnValue({ lean: mockLean });
      model.findOne.mockImplementationOnce(mockFindOne);

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

      const mockLean = jest.fn().mockReturnValue(mockedUser);
      const mockFindOne = jest.fn().mockReturnValue({ lean: mockLean });
      model.findOne.mockImplementationOnce(mockFindOne);

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

      const mockLean = jest.fn().mockReturnValue(mockedUser);
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      const mockFindOne = jest.fn().mockReturnValue({ select: mockSelect });
      model.findOne.mockImplementationOnce(mockFindOne);

      const result = await service.findOneByEmailWithPassword(mockedUser.email);

      expect(result).toEqual(mockedUser);
      expect(result.password).toBeDefined();
      expect(model.findOne).toHaveBeenCalledWith({ email: mockedUser.email });
    });
  });

  describe('findOneByEmailWithPuuid', () => {
    it('should return a user with a puuid', async () => {
      const mockedUser: IUser = {
        _id: new Types.ObjectId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        puuid: faker.string.alphanumeric(78),
        gameName: faker.internet.userName(),
        tagLine: faker.string.alphanumeric(5),
        server: RIOT_SERVERS.BR1,
      };

      const mockLean = jest.fn().mockReturnValue(mockedUser);
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      const mockFindOne = jest.fn().mockReturnValue({ select: mockSelect });
      model.findOne.mockImplementationOnce(mockFindOne);

      const result = await service.findOneByEmailWithPuuid(mockedUser.email);

      expect(result).toEqual(mockedUser);
      expect(result.puuid).toBeDefined();
      expect(model.findOne).toHaveBeenCalledWith({ email: mockedUser.email });
    });
  });

  describe('findOneByUsername', () => {
    it('should return null if user not found', async () => {
      const mockLean = jest.fn().mockReturnValue(null);
      const mockFindOne = jest.fn().mockReturnValue({ lean: mockLean });
      model.findOne.mockImplementationOnce(mockFindOne);

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

      const mockLean = jest.fn().mockReturnValue(mockedUser);
      const mockFindOne = jest.fn().mockReturnValue({ lean: mockLean });
      model.findOne.mockImplementationOnce(mockFindOne);

      const result = await service.findOneByUsername(mockedUser.username);

      expect(result).toEqual(mockedUser);
      expect(model.findOne).toHaveBeenCalledWith({
        username: mockedUser.username,
      });
    });
  });

  describe('findOneById', () => {
    it('should return null if user not found', async () => {
      const mockLean = jest.fn().mockReturnValue(null);
      const mockFindById = jest.fn().mockReturnValue({ lean: mockLean });
      model.findById.mockImplementationOnce(mockFindById);

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

      const mockLean = jest.fn().mockReturnValue(mockedUser);
      const mockFindById = jest.fn().mockReturnValue({ lean: mockLean });
      model.findById.mockImplementationOnce(mockFindById);

      const userId = mockedUser._id.toString();
      const result = await service.findOneById(userId);

      expect(result).toEqual(mockedUser);
      expect(model.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockedUser: CreateUserDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const result = await service.create(mockedUser);
      expect(model).toHaveBeenCalledWith(mockedUser);
      expect(mockSavedDoc.toJSON).toHaveBeenCalled();
      expect(result).toEqual(mockedUserFields);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userId = new Types.ObjectId().toString();
      const updatedUserInfo: CreateUserDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const expectedUpdatedUser = { ...updatedUserInfo, _id: userId };

      const mockLean = jest.fn().mockReturnValue(expectedUpdatedUser);
      const mockFindByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ lean: mockLean });
      model.findByIdAndUpdate.mockImplementationOnce(mockFindByIdAndUpdate);

      const result = await service.update(userId, updatedUserInfo);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updatedUserInfo,
        {
          returnDocument: 'after',
        },
      );
      expect(result).toEqual(expectedUpdatedUser);
    });
  });

  describe('getAllUsers', () => {
    describe('filter', () => {
      it('should remove sensible fields from pagination', async () => {
        const mockLean = jest.fn().mockReturnValue([mockedUserFields]);
        const mockSkip = jest.fn().mockReturnValue({ lean: mockLean });
        const mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
        const mockFind = jest.fn().mockReturnValue({ limit: mockLimit });
        model.find.mockImplementationOnce(mockFind);

        const filter: QueryFilter<User> = {
          password: faker.internet.password(),
          refreshToken: TestMockUtils.invalidJwt(),
        };
        await service.getAllUsers(filter);
        expect(model.find).toHaveBeenCalledWith({});
      });
      it('should use passed filter', async () => {
        const mockLean = jest.fn().mockReturnValue([mockedUserFields]);
        const mockSkip = jest.fn().mockReturnValue({ lean: mockLean });
        const mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
        const mockFind = jest.fn().mockReturnValue({ limit: mockLimit });
        model.find.mockImplementationOnce(mockFind);

        const filter: QueryFilter<User> = {
          username: faker.internet.userName(),
        };
        await service.getAllUsers(filter);
        expect(model.find).toHaveBeenCalledWith(filter);
      });
      it('should use empty object if filter is not defined', async () => {
        const mockLean = jest.fn().mockReturnValue([mockedUserFields]);
        const mockSkip = jest.fn().mockReturnValue({ lean: mockLean });
        const mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
        const mockFind = jest.fn().mockReturnValue({ limit: mockLimit });
        model.find.mockImplementationOnce(mockFind);

        await service.getAllUsers();
        expect(model.find).toHaveBeenCalledWith({});
      });
    });

    describe('query', () => {
      it('should use passed pagination', async () => {
        const mockLean = jest.fn().mockReturnValue([mockedUserFields]);
        const mockSkip = jest.fn().mockReturnValue({ lean: mockLean });
        const mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
        const mockFind = jest.fn().mockReturnValue({ limit: mockLimit });
        model.find.mockImplementationOnce(mockFind);

        const expectedCountDocuments = 34;
        model.countDocuments.mockResolvedValue(expectedCountDocuments);

        const pagination = { limit: 20, offset: 20 };
        const result = await service.getAllUsers({}, pagination);

        expect(model.countDocuments).toHaveBeenCalled();
        expect(result.count).toEqual(expectedCountDocuments);
        expect(mockLimit).toHaveBeenCalledWith(pagination.limit);
        expect(mockSkip).toHaveBeenCalledWith(pagination.offset);
      });

      describe('should use default values for pagination when used without arguments', () => {
        it('should use passed pagination', async () => {
          const mockLean = jest.fn().mockReturnValue([mockedUserFields]);
          const mockSkip = jest.fn().mockReturnValue({ lean: mockLean });
          const mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
          const mockFind = jest.fn().mockReturnValue({ limit: mockLimit });
          model.find.mockImplementationOnce(mockFind);

          await service.getAllUsers();

          expect(mockLimit).toHaveBeenCalledWith(DEFAULT_LIMIT);
          expect(mockSkip).toHaveBeenCalledWith(DEFAULT_OFFSET);
        });
      });
    });
  });

  describe('updateRefreshToken', () => {
    it('should update only refreshToken', async () => {
      const userId = new Types.ObjectId().toString();
      const mockJwt = TestMockUtils.invalidJwt();
      await service.updateRefreshToken(userId, mockJwt);
      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: userId },
        { refreshToken: mockJwt },
      );
    });
  });

  describe('removeRefreshToken', () => {
    it('should remove only refreshToken', async () => {
      const userId = new Types.ObjectId().toString();
      await service.removeRefreshToken(userId);
      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: userId },
        { refreshToken: null },
      );
    });
  });

  describe('updateUserWithRiotData', () => {
    it('should update user with riot account data', async () => {
      const tagLine = faker.string.alphanumeric(5);
      const gameName = faker.internet.userName();
      const server = RIOT_SERVERS.BR1;
      const puuid = faker.string.alphanumeric(78);

      const mockedUser: IUser = {
        _id: new Types.ObjectId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        tagLine,
        gameName,
        puuid,
      };

      const mockLean = jest.fn().mockReturnValue({
        mockedUser,
      });
      const mockFindByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ lean: mockLean });
      model.findByIdAndUpdate.mockImplementationOnce(mockFindByIdAndUpdate);

      const mockedGetAccountByRiotId = jest.fn().mockResolvedValue({
        tagLine,
        gameName,
        puuid,
      });
      riotApiService.getAccountByRiotId.mockImplementationOnce(
        mockedGetAccountByRiotId,
      );

      await service.updateUserWithRiotData(mockedUser, {
        tagLine,
        gameName,
        server,
      });

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockedUser._id.toString(),
        {
          puuid,
          tagLine,
          gameName,
          server,
        },
        {
          returnDocument: 'after',
        },
      );
    });
  });
});
