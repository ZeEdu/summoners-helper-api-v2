import { AppModule } from '../../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');
import request = require('supertest');
import { Model } from 'mongoose';
import { IUser, User, UserDocument } from '../../users/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthController', () => {
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

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('register', () => {
    it('POST /auth/register → retorna accessToken', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.word.verb({ length: { min: 5, max: 16 } }),
        password: faker.internet.password({ prefix: '1!Ab' }),
        email: faker.internet.email(),
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserPayload)
        .expect(201)
        .expect((response) => {
          expect(response.body.accessToken).toBeDefined();
          checkRefreshCookieOnResponse(response.headers);
        })
        .catch((err) => {
          console.log({ err });
        });
    });

    describe('with error', () => {
      describe('username', () => {
        it('without username', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'O nome de usuário deve ter no máximo 16 caracteres',
            'O nome de usuário deve ter pelo menos 5 caracteres',
            'Nome de usuário é obrigátorio',
            'Formato inválido',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });

        it('with a non string username', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: faker.number.int({ min: 10_000, max: 20_000 }),
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'O nome de usuário deve ter no máximo 16 caracteres',
            'O nome de usuário deve ter pelo menos 5 caracteres',
            'Formato inválido',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });

        it('without minimal length', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: 'inva',
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'O nome de usuário deve ter pelo menos 5 caracteres',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
      });

      describe('password', () => {
        it('with empty field', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
            'A senha deve ter no máximo 64 caracteres',
            'A senha deve ter no mínimo 8 caracteres',
            'Senha é obrigátoria',
            'Formato inválido',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
        it('with invalid type format', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.number.int({ min: 10_000, max: 20_000 }),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
            'A senha deve ter no máximo 64 caracteres',
            'A senha deve ter no mínimo 8 caracteres',
            'Formato inválido',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
        it('with invalid minimal length', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password({ prefix: '1!Ab', length: 6 }),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = ['A senha deve ter no mínimo 8 caracteres'];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
        it('with invalid maximum lenght', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password({ prefix: '1!Ab', length: 65 }),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = ['A senha deve ter no máximo 64 caracteres'];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
        it('with invalid pattern', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password(),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
      });

      describe('email', () => {
        it('with empty field', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              password: faker.internet.password({ prefix: '1!Ab' }),
            })
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = [
            'Email é obrigátorio',
            'Email deve ser válido',
          ];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
        it('with invalid format', async () => {
          const createUserPayload = {
            username: faker.word.verb({ length: { min: 5, max: 16 } }),
            password: faker.internet.password({ prefix: '1!Ab' }),
            email: faker.word.verb({ length: 16 }),
          };

          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserPayload)
            .expect(400);

          expect(body.error).toBe('Bad Request');

          const expectedErrors = ['Email deve ser válido'];
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error);
          });
        });
      });
    });
  });

  describe('login', () => {
    it('POST /auth/login → retorna accessToken', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.word.verb({ length: { min: 5, max: 16 } }),
        password: faker.internet.password({ prefix: '1!Ab' }),
        email: faker.internet.email(),
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserPayload)
        .expect(201)
        .catch((err) => {
          console.log({ err });
        });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: createUserPayload.email,
          password: createUserPayload.password,
        })
        .expect(201);

      checkRefreshCookieOnResponse(response.headers);
    });

    describe('with error', () => {
      it('with wrong email', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.word.verb({ length: { min: 5, max: 16 } }),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(createUserPayload)
          .expect(201)
          .catch((err) => {
            console.log({ err });
          });

        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: faker.internet.email(),
            password: createUserPayload.password,
          })
          .expect(401)
          .expect(({ body }) => {
            expect(body.error).toBe('Unauthorized');
            expect(body.message).toBe('Usuário não encontrado');
          });
      });
      it('with wrong password', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.word.verb({ length: { min: 5, max: 16 } }),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(createUserPayload)
          .expect(201)
          .catch((err) => {
            console.log({ err });
          });

        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: createUserPayload.email,
            password: faker.internet.password(),
          })
          .expect(401)
          .expect(({ body }) => {
            expect(body.error).toBe('Unauthorized');
            expect(body.message).toBe('Senha não está correta');
          });
      });
    });
  });

  describe('logout', () => {
    it('POST /auth/logout → remove o refreshToken do usuário', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.word.verb({ length: { min: 5, max: 16 } }),
        password: faker.internet.password({ prefix: '1!Ab' }),
        email: faker.internet.email(),
      };

      const createUserResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserPayload)
        .expect(201);

      const logoutResponse = await request(app.getHttpServer())
        .get('/auth/logout')
        .set('Authorization', `Bearer ${createUserResponse.body.accessToken}`)
        .expect(200);

      const storedUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      expect(storedUser.refreshToken).toBeNull();

      const refreshTokenCookie = extractCookie(
        logoutResponse.headers as unknown as Record<string, string[]>,
        'refresh_token',
      );
      expect(refreshTokenCookie).toBeUndefined();
    });
  });

  describe('refresh', () => {
    it('POST /auth/refresh-token → deve atualizar o refresh-token', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.word.verb({ length: { min: 5, max: 16 } }),
        password: faker.internet.password({ prefix: '1!Ab' }),
        email: faker.internet.email(),
      };

      const registerUserResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserPayload)
        .expect(201);

      const oldRefreshTokenUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      const refreshToken = extractCookie(
        registerUserResponse.headers as unknown as Record<string, string[]>,
        'refresh_token',
      );

      await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Cookie', refreshToken)
        .expect(200);

      const updateRefreshTokenUser = (await userModel
        .findOne({
          email: createUserPayload.email,
        })
        .lean()) as IUser;

      expect(oldRefreshTokenUser.refreshToken).not.toBe(
        updateRefreshTokenUser.refreshToken,
      );
    });
  });
});
