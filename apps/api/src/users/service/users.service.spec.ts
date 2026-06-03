import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

let mongod: MongoMemoryServer

describe('UsersService', () => {
  let service: UsersService;


  beforeEach(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), MongooseModule.forFeature(
        [{ name: User.name, schema: UserSchema }]
      )],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should create and retrive a user', async () => {
    const createdUser = await service.create({ email: 'email@email.com', username: 'user', password: 'pass' })
    const storedUsers = await service.findAll()

    expect(createdUser).toBeDefined()

    expect(storedUsers).toHaveLength(1)

  })
});
