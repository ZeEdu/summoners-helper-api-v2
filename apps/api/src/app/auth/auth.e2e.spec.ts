import { AppModule } from '../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto, IUser } from '@org/contracts';
import cookieParser = require('cookie-parser');
import request = require('supertest');

describe('AuthController e2e', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;

  function extractCookie(headers: Record<string, string[]>, name: string): string {
    const cookies = headers['set-cookie'] as string[];
    if (!cookies) {
      throw new Error('No set-cookie found')
    }

    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    if (!cookie) {
      throw new Error('No cookie found')
    }

    return cookie
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

  function getCookieFromHeader(headers: Record<string, string>) {
    if (!headers['set-cookie']?.[0]) {
      return null
    }

    const refreshTokenCookie = headers['set-cookie'][0];
    return transformCookie(refreshTokenCookie);
  }

  function checkRefreshCookieOnResponse(headers: Record<string, string>) {
    const cookie = getCookieFromHeader(headers)

    expect(cookie?.refresh_token).toBeDefined();
    expect(cookie?.max_age).toBeDefined();
    expect(cookie?.path).toBeDefined();
    expect(cookie?.expires).toBeDefined();
    expect(cookie?.httponly).toBeDefined();
    expect(cookie?.samesite).toBeDefined();
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

  describe('register', () => {
    describe('mobile', () => {
      it('POST /auth/mobile/register → retorna accessToken', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        await request(app.getHttpServer())
          .post('/auth/mobile/register')
          .send(createUserPayload)
          .expect(201)
          .expect((response) => {
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            const cookie = getCookieFromHeader(response.headers);
            expect(cookie?.refresh_token).toBeUndefined();
          })
      });

      describe('with error', () => {
        describe('username', () => {
          it('without username', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "username"
            });
          });

          it('with empty string', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
                username: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Nome de usuário é obrigátorio",
              "path": "username"
            });
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "O nome de usuário deve ter pelo menos 5 caracteres",
              "path": "username"
            });
          })

          it('with a non string username', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                username: faker.number.int({ min: 10_000, max: 20_000 }),
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "username"
            });
          });

          it('without minimal length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                username: 'inva',
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "O nome de usuário deve ter pelo menos 5 caracteres",
              "path": "username"
            });
          });

          it('with over maximum length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                username: faker.string.alpha(17),
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": "O nome de usuário deve ter no máximo 16 caracteres",
              "path": "username"
            });
          });
        })

        describe('password', () => {
          it('with empty field', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "password"
            });
          });

          it('with empty string', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: '',
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Senha é obrigátoria",
              "path": "password"
            });
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "A senha deve ter no mínimo 8 caracteres",
              "path": "password"
            });
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "A senha deve ter ao menos uma letra maiúscula, minúscula, número e caracter especial (@, $, !, %, ? ou &)",
              "path": "password"
            });
          });

          it('with invalid type format', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: faker.number.int({ min: 10_000, max: 20_000 }),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "password"
            });
          });

          it('with invalid minimal length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab', length: 6 }),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "A senha deve ter no mínimo 8 caracteres",
              "path": "password"
            });
          });

          it('with invalid maximum length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab', length: 65 }),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": "A senha deve ter no máximo 64 caracteres",
              "path": "password"
            });
          });

          it('with invalid pattern', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                password: faker.internet.password(),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "A senha deve ter ao menos uma letra maiúscula, minúscula, número e caracter especial (@, $, !, %, ? ou &)",
              "path": "password"
            });
          });
        });

        describe('email', () => {
          it('with empty field', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                username: faker.string.alpha(16),
                password: faker.internet.password({ prefix: '1!Ab' }),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Email deve ser válido",
              "path": "email"
            });
          });

          it('with empty string', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                email: '',
                username: faker.string.alpha(16),
                password: faker.internet.password({ prefix: '1!Ab' }),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Email deve ser válido",
              "path": "email"
            });
          });

          it('with invalid format', async () => {
            const createUserPayload = {
              username: faker.string.alpha(16),
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.word.verb({ length: 16 }),
            };

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUserPayload)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Email deve ser válido",
              "path": "email"
            });
          });
        });
      });
    })

    describe('web', () => {
      it('POST /auth/web/register → retorna accessToken', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        await request(app.getHttpServer())
          .post('/auth/web/register')
          .send(createUserPayload)
          .expect(201)
          .expect((response) => {
            expect(response.body.accessToken).toBeDefined();
            checkRefreshCookieOnResponse(response.headers);
          })
      });

      describe('with error', () => {
        describe('username', () => {
          it('without username', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "username"
            })
          });

          it('with empty string', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
                username: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Nome de usuário é obrigátorio",
              "path": "username"
            })
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "O nome de usuário deve ter pelo menos 5 caracteres",
              "path": "username"
            })
          })

          it('with a non string username', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                username: faker.number.int({ min: 10_000, max: 20_000 }),
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "username"
            })
          });

          it('without minimal length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                username: 'inva',
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "O nome de usuário deve ter pelo menos 5 caracteres",
              "path": "username"
            })
          });

          it('with over maximum length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                username: faker.string.alpha(17),
                password: faker.internet.password({ prefix: '1!Ab' }),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": "O nome de usuário deve ter no máximo 16 caracteres",
              "path": "username"
            })
          });
        })

        describe('password', () => {
          it('with empty field', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "password"
            })
          });

          it('with empty string', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: '',
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Senha é obrigátoria",
              "path": "password"
            })

            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "A senha deve ter no mínimo 8 caracteres",
              "path": "password"
            })

            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "A senha deve ter ao menos uma letra maiúscula, minúscula, número e caracter especial (@, $, !, %, ? ou &)",
              "path": "password"
            })
          });

          it('with invalid type format', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: faker.number.int({ min: 10_000, max: 20_000 }),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Formato inválido",
              "path": "password"
            })
          });

          it('with invalid minimal length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab', length: 6 }),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": 'A senha deve ter no mínimo 8 caracteres',
              "path": "password"
            })
          });

          it('with invalid maximum length', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: faker.internet.password({ prefix: '1!Ab', length: 65 }),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": 'A senha deve ter no máximo 64 caracteres',
              "path": "password"
            })
          });

          it('with invalid pattern', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                password: faker.internet.password(),
                username: faker.string.alpha(16),
                email: faker.internet.email(),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": 'A senha deve ter ao menos uma letra maiúscula, minúscula, número e caracter especial (@, $, !, %, ? ou &)',
              "path": "password"
            })
          });
        });

        describe('email', () => {
          it('with empty field', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                username: faker.string.alpha(16),
                password: faker.internet.password({ prefix: '1!Ab' }),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Email deve ser válido",
              "path": "email"
            })
          });

          it('with empty string', async () => {
            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                email: '',
                username: faker.string.alpha(16),
                password: faker.internet.password({ prefix: '1!Ab' }),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Email deve ser válido",
              "path": "email"
            })
          });

          it('with invalid format', async () => {
            const createUserPayload = {
              username: faker.string.alpha(16),
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.word.verb({ length: 16 }),
            };

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send(createUserPayload)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Email deve ser válido",
              "path": "email"
            })
          });
        });
      });
    })
  });

  describe('login', () => {
    describe('mobile', () => {
      it('POST /auth/mobile/login → retorna accessToken e refreshToken', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        await request(app.getHttpServer())
          .post('/auth/mobile/register')
          .send(createUserPayload)
          .expect(201)
          .catch((err) => {
            console.log({ err });
          });

        const response = await request(app.getHttpServer())
          .post('/auth/mobile/login')
          .send({
            email: createUserPayload.email,
            password: createUserPayload.password,
          })
          .expect(201);

        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()

        const cookie = getCookieFromHeader(response.headers)
        expect(cookie?.refresh_token).toBeUndefined()
      });

      describe('with error', () => {
        it('with wrong email', async () => {
          const createUserPayload: CreateUserDto = {
            username: faker.string.alpha(16),
            password: faker.internet.password({ prefix: '1!Ab' }),
            email: faker.internet.email(),
          };

          await request(app.getHttpServer())
            .post('/auth/mobile/register')
            .send(createUserPayload)
            .expect(201)
            .catch((err) => {
              console.log({ err });
            });

          await request(app.getHttpServer())
            .post('/auth/mobile/login')
            .send({
              email: faker.internet.email(),
              password: createUserPayload.password,
            })
            .expect(401)
            .expect(({ body }) => {
              expect(body.error).toBe('Unauthorized');
              expect(body.message).toBe('Email ou senha incorretos');
            });
        });
        it('with wrong password', async () => {
          const createUserPayload: CreateUserDto = {
            username: faker.string.alpha(16),
            password: faker.internet.password({ prefix: '1!Ab' }),
            email: faker.internet.email(),
          };

          await request(app.getHttpServer())
            .post('/auth/mobile/register')
            .send(createUserPayload)
            .expect(201)
            .catch((err) => {
              console.log({ err });
            });

          await request(app.getHttpServer())
            .post('/auth/mobile/login')
            .send({
              email: createUserPayload.email,
              password: faker.internet.password(),
            })
            .expect(401)
            .expect(({ body }) => {
              expect(body.error).toBe('Unauthorized');
              expect(body.message).toBe('Email ou senha incorretos');
            });
        });
      });
    })

    describe('web', () => {
      it('POST /auth/web/login → retorna accessToken', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        await request(app.getHttpServer())
          .post('/auth/web/register')
          .send(createUserPayload)
          .expect(201)
          .catch((err) => {
            console.log({ err });
          });

        const response = await request(app.getHttpServer())
          .post('/auth/web/login')
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
            username: faker.string.alpha(16),
            password: faker.internet.password({ prefix: '1!Ab' }),
            email: faker.internet.email(),
          };

          await request(app.getHttpServer())
            .post('/auth/web/register')
            .send(createUserPayload)
            .expect(201)
            .catch((err) => {
              console.log({ err });
            });

          await request(app.getHttpServer())
            .post('/auth/web/login')
            .send({
              email: faker.internet.email(),
              password: createUserPayload.password,
            })
            .expect(401)
            .expect(({ body }) => {
              expect(body.error).toBe('Unauthorized');
              expect(body.message).toBe('Email ou senha incorretos');
            });
        });
        it('with wrong password', async () => {
          const createUserPayload: CreateUserDto = {
            username: faker.string.alpha(16),
            password: faker.internet.password({ prefix: '1!Ab' }),
            email: faker.internet.email(),
          };

          await request(app.getHttpServer())
            .post('/auth/web/register')
            .send(createUserPayload)
            .expect(201)
            .catch((err) => {
              console.log({ err });
            });

          await request(app.getHttpServer())
            .post('/auth/web/login')
            .send({
              email: createUserPayload.email,
              password: faker.internet.password(),
            })
            .expect(401)
            .expect(({ body }) => {
              expect(body.error).toBe('Unauthorized');
              expect(body.message).toBe('Email ou senha incorretos');
            });
        });
      });
    })
  });

  describe('logout', () => {
    it('POST /auth/logout → remove o refreshToken do usuário', async () => {
      const createUserPayload: CreateUserDto = {
        username: faker.string.alpha(16),
        password: faker.internet.password({ prefix: '1!Ab' }),
        email: faker.internet.email(),
      };

      const createUserResponse = await request(app.getHttpServer())
        .post('/auth/web/register')
        .send(createUserPayload)
        .expect(201);

      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({})
        .set('Authorization', `Bearer ${createUserResponse.body.accessToken}`)
        .expect(204);

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
      const token = refreshTokenCookie?.split(';')[0]
        .replaceAll('refresh_token=', '');
      expect(token).toBeFalsy();
    });
  });

  describe('refresh', () => {
    describe('mobile', () => {
      it('POST /auth/mobile/refresh-token → deve atualizar o refresh-token', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        const registerUserResponse = await request(app.getHttpServer())
          .post('/auth/mobile/register')
          .send(createUserPayload)
          .expect(201);

        const oldRefreshTokenUser = (await userModel
          .findOne({
            email: createUserPayload.email,
          })
          .lean()) as IUser;

        await request(app.getHttpServer())
          .post('/auth/mobile/refresh')
          .send({ 'refreshToken': registerUserResponse.body.refreshToken })
          .expect(201);

        const updateRefreshTokenUser = (await userModel
          .findOne({
            email: createUserPayload.email,
          })
          .lean()) as IUser;

        expect(oldRefreshTokenUser.refreshToken).not.toBe(
          updateRefreshTokenUser.refreshToken,
        );
      });
    })
    describe('web', () => {
      it('POST /auth/web/refresh-token → deve atualizar o refresh-token', async () => {
        const createUserPayload: CreateUserDto = {
          username: faker.string.alpha(16),
          password: faker.internet.password({ prefix: '1!Ab' }),
          email: faker.internet.email(),
        };

        const registerUserResponse = await request(app.getHttpServer())
          .post('/auth/web/register')
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
          .post('/auth/web/refresh')
          .set('Cookie', refreshToken)
          .expect(201);

        const updateRefreshTokenUser = (await userModel
          .findOne({
            email: createUserPayload.email,
          })
          .lean()) as IUser;

        expect(oldRefreshTokenUser.refreshToken).not.toBe(
          updateRefreshTokenUser.refreshToken,
        );
      });
    })

  });
});
