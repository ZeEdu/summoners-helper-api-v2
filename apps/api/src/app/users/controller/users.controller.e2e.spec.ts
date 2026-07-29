import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import cookieParser = require('cookie-parser');
import { AppModule } from '../../app.module';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  function extractCookie(headers: Record<string, string[]>, name: string) {
    const cookies = headers['set-cookie'] as string[];
    return cookies?.find((c) => c.startsWith(`${name}=`));
  }

  function transformCookie(cookie: string) {
    return cookie
      .split(';')
      .map((cookieProperty) => {
        const fields = cookieProperty.split('=');

        const key = fields[0].trim().toLowerCase().replace(/-/g, '_');
        const value = fields[1] ?? true;

        return { [key]: value };
      })
      .reduce((previous, current) => ({ ...previous, ...current }), {});
  }

  function checkRefreshCookieOnResponse(headers: Record<string, string>) {
    const refreshTokenCookie = headers['set-cookie'][0];

    const cookie = transformCookie(refreshTokenCookie);

    expect(cookie.refresh_token).toBeDefined();
    expect(cookie.max_age).toBeDefined();
    expect(cookie.path).toBeDefined();
    expect(cookie.expires).toBeDefined();
    expect(cookie.httponly).toBeDefined();
    expect(cookie.samesite).toBeDefined();
  }

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
