import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import cookieParser = require('cookie-parser');
import { AppModule } from '../../app.module';

xdescribe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.deleteMany();

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should be defined', () => {
      // Apenas um placeholder para testar a rota
      expect(app).toBeDefined();
    });
  });
});
