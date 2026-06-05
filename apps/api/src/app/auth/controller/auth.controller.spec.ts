import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../../users/service/users.service';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../users/schema/user.schema';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';


let mongodb: MongoMemoryServer

describe('AuthController', () => {
  let controller: AuthController;
  let userModel: Model<User>

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      providers: [UsersService, AuthService]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userModel = module.get<Model<User>>(getModelToken(User.name))
  });

  afterAll(async () => {
    await mongodb.stop()
  })

  describe('register', () => {
    it('should call authService.register with createUserDto', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email()
      }

      const accessToken = await controller.register(createUserPayload)
      expect(accessToken).toBeDefined()
      expect(accessToken).toHaveProperty('accessToken')

      const createdUser = await userModel.findOne({ email: createUserPayload.email })
      expect(createdUser).toBeDefined()
    })


    describe('with error', () => {
      it('email already used', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email()
        }

        // Cria um usuário
        await controller.register(createUserPayload)

        // Tenta criar um novo usuário com o mesmo email
        const alreadyInUseEmailPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: createUserPayload.email
        }

        // Tenta criar um usuário com o email repetido
        await expect(controller.register(alreadyInUseEmailPayload)).rejects.toThrow('Email já está sendo utilizado')
      })

      it('username already used', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email()
        }

        // Cria um usuário
        await controller.register(createUserPayload)

        // Tenta criar um novo usuário com o mesmo email
        const alreadyInUseEmailPayload: CreateUserDto = {
          username: createUserPayload.username,
          password: faker.internet.password(),
          email: faker.internet.email()
        }

        // Tenta criar um usuário com o email repetido
        await expect(controller.register(alreadyInUseEmailPayload)).rejects.toThrow('Nome de usuário já está sendo utilizado')
      })

      // it('without email', () => {

      // })
      // it('without password', () => {

      // })
    })

    // it('should return accessToken wrapped in an object', () => { })

    // it('should propagate errors thrown by authService.register', async () => {
    //   const createUserPayload: CreateUserDto = {
    //     username: '112312',
    //     password: 'asdasd',
    //     email: 'qweqwe'
    //   }

    //   const accessToken = await controller.register(createUserPayload)
    // })
  })

  // describe('login', () => {
  //   it('should call authService.login with current user', () => {

  //   })

  //   it('should return the result from authService.login', () => {

  //   })

  //   it('should propagate errors thrown by authService.login', () => {

  //   })
  // })
})
