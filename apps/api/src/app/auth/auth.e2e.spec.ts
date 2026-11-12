import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, IUser } from '@org/contracts';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../users/schema/user.schema';
import cookieParser = require('cookie-parser');
import request = require('supertest');

describe('AuthController e2e', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;

  function createFakeUserPayload(defaultProperties?: Partial<CreateUserDto>) {
    const uniqueId = faker.string.uuid().slice(0, 12);
    return {
      username: `user_${uniqueId}`,
      password: 'TestPass123',
      email: `user_${uniqueId}@example.com`,
      ...defaultProperties
    }
  }

  function extractRefreshTokenFromCookies(cookies: string) {
    const refreshToken = cookies.split(';').find((c) => c.startsWith('refresh_token'))

    if (!refreshToken) {
      throw new Error('refreshToken not found')
    }

    return refreshToken
  }

  function extractCookiesFromRequest(headers: {
    [index: string]: string;
  }, name: string): string {
    const cookies = headers['set-cookie'] ?? [];

    if (!Array.isArray(cookies)) {
      throw new Error('Not a valid format')
    }

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
    const transformEntries = cookie.split(';').map((property) => {
      const separatorIndex = property.indexOf('=')

      const key = (separatorIndex > -1 ? property
        .slice(0, separatorIndex) : property)
        .trim()
        .toLocaleLowerCase()
        .replace(/-/g, '_')

      const value = separatorIndex === -1 ? true : property.slice(separatorIndex + 1).trim()
      return [key, value]
    })

    return Object.fromEntries(transformEntries)
  }

  function getCookiesFromHeader(headers: {
    [index: string]: string;
  }) {
    const cookies = headers['set-cookie'] ?? []
    if (!Array.isArray(cookies)) {
      throw new Error('Not a valid format')
    }

    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refresh_token='))
    return refreshTokenCookie ? transformCookie(refreshTokenCookie) : null
  }

  function validateCookiesOnResponse(headers: {
    [index: string]: string;
  }) {
    const cookies = getCookiesFromHeader(headers)

    expect(cookies?.refresh_token).toBeDefined();
    expect(cookies?.max_age).toBeDefined();
    expect(cookies?.path).toBeDefined();
    expect(cookies?.expires).toBeDefined();
    expect(cookies?.httponly).toBeDefined();
    expect(cookies?.samesite).toBeDefined();
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  })

  describe('register', () => {
    describe('mobile', () => {
      it('POST /auth/mobile/register → retorna accessToken', async () => {
        const createUserPayload = createFakeUserPayload()

        await request(app.getHttpServer())
          .post('/auth/mobile/register')
          .send(createUserPayload)
          .expect(201)
          .expect((response) => {
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            const cookie = getCookiesFromHeader(response.headers);
            expect(cookie?.refresh_token).toBeUndefined();
          })
      });

      describe('with error', () => {
        describe('username', () => {
          it('without username', async () => {
            const createUserPayload = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUserPayload,
                username: undefined
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "username"
            });
          });

          it('with empty string', async () => {
            const createUser = createFakeUserPayload({ username: '' })

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');

            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 6 caracteres.",
              "path": "username"
            });
          })

          it('with a non string username', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                username: faker.number.int({ min: 10_000, max: 20_000 })
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "username"
            });
          });

          it('without minimal length', async () => {
            const createUser = createFakeUserPayload({ username: faker.string.alpha(4) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 6 caracteres.",
              "path": "username"
            });
          });

          it('with over maximum length', async () => {
            const createUser = createFakeUserPayload({ username: faker.string.alpha(65) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": "Informe no máximo 64 caracteres.",
              "path": "username"
            });
          });
        })

        describe('password', () => {
          it('with empty field', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                password: undefined
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "password"
            });
          });

          it('with empty string', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                password: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');

            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 8 caracteres.",
              "path": "password"
            });
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "A senha deve ter ao menos uma letra maiúscula e minúscula.",
              "path": "password"
            });
          });

          it('with invalid type format', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                password: faker.number.int({ min: 10_000, max: 20_000 }),
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "password"
            });
          });

          it('with invalid minimal length', async () => {
            const createUser = createFakeUserPayload({ password: 'Abc1' })

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 8 caracteres.",
              "path": "password"
            });
          });

          it('with invalid maximum length', async () => {
            const createUser = createFakeUserPayload({ password: 'Abc1234' + 'x'.repeat(122) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": "Informe no máximo 128 caracteres.",
              "path": "password"
            });
          });

          it('with invalid pattern', async () => {
            const createUser = createFakeUserPayload()
            const invalidPassword = 'adasdasdasd'

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                password: invalidPassword
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "A senha deve ter ao menos uma letra maiúscula e minúscula.",
              "path": "password"
            });
          });
        });

        describe('email', () => {
          it('with empty field', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                email: undefined
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "email"
            });
          });

          it('with empty string', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send({
                ...createUser,
                email: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Informe um endereço de e-mail válido.",
              "path": "email"
            });
          });

          it('with invalid format', async () => {
            const createUserPayload = createFakeUserPayload({ email: faker.string.alpha(16) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/mobile/register')
              .send(createUserPayload)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Informe um endereço de e-mail válido.",
              "path": "email"
            });
          });
        });
      });
    })

    describe('web', () => {
      it('POST /auth/web/register → retorna accessToken', async () => {
        const createUserPayload = createFakeUserPayload();

        await request(app.getHttpServer())
          .post('/auth/web/register')
          .send(createUserPayload)
          .expect(201)
          .expect((response) => {
            expect(response.body.accessToken).toBeDefined();
            validateCookiesOnResponse(response.headers);
          })
      });

      describe('with error', () => {
        describe('username', () => {
          it('without username', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                username: undefined
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "username"
            })
          });

          it('with empty string', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                username: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 6 caracteres.",
              "path": "username"
            })
          })

          it('with a non string username', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                username: faker.number.int({ min: 10_000, max: 20_000 })
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "username"
            })
          });

          it('without minimal length', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                username: 'inva'
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 6 caracteres.",
              "path": "username"
            })
          });

          it('with over maximum length', async () => {
            const createUser = createFakeUserPayload({ username: faker.string.alpha(65) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": "Informe no máximo 64 caracteres.",
              "path": "username"
            })
          });
        })

        describe('password', () => {
          it('with empty field', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                password: undefined
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "password"
            })
          });

          it('with empty string', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                password: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');

            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": "Informe pelo menos 8 caracteres.",
              "path": "password"
            })

            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "A senha deve ter ao menos uma letra maiúscula e minúscula.",
              "path": "password"
            })
          });

          it('with invalid type format', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                password: faker.number.int({ min: 10_000, max: 20_000 })
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "password"
            })
          });

          it('with invalid minimal length', async () => {
            const createUser = createFakeUserPayload({ password: 'Abc1' })

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_small",
              "message": 'Informe pelo menos 8 caracteres.',
              "path": "password"
            })
          });

          it('with invalid maximum length', async () => {
            const createUser = createFakeUserPayload({ password: 'Abc1234' + 'x'.repeat(122) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send(createUser)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "too_big",
              "message": 'Informe no máximo 128 caracteres.',
              "path": "password"
            })
          });

          it('with invalid pattern', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                password: 'adasdasdasd'
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": 'A senha deve ter ao menos uma letra maiúscula e minúscula.',
              "path": "password"
            })
          });
        });

        describe('email', () => {
          it('with empty field', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                email: undefined
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_type",
              "message": "Tipo de dado inválido.",
              "path": "email"
            })
          });

          it('with empty string', async () => {
            const createUser = createFakeUserPayload()

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send({
                ...createUser,
                email: ''
              })
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Informe um endereço de e-mail válido.",
              "path": "email"
            })
          });

          it('with invalid format', async () => {
            const createUserPayload = createFakeUserPayload({ email: faker.string.alpha(16) })

            const { body } = await request(app.getHttpServer())
              .post('/auth/web/register')
              .send(createUserPayload)
              .expect(400);

            expect(body.error).toBe('Bad Request');
            expect(body.message).toContainEqual({
              "code": "invalid_format",
              "message": "Informe um endereço de e-mail válido.",
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
        const createUserPayload = createFakeUserPayload()

        await request(app.getHttpServer())
          .post('/auth/mobile/register')
          .send(createUserPayload)
          .expect(201)

        const response = await request(app.getHttpServer())
          .post('/auth/mobile/login')
          .send({
            email: createUserPayload.email,
            password: createUserPayload.password,
          })
          .expect(201);

        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()

        const cookie = getCookiesFromHeader(response.headers)
        expect(cookie?.refresh_token).toBeUndefined()
      });

      describe('with error', () => {
        it('with wrong email', async () => {
          const createUserPayload = createFakeUserPayload()

          await request(app.getHttpServer())
            .post('/auth/mobile/register')
            .send(createUserPayload)
            .expect(201)

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
          const createUserPayload = createFakeUserPayload()

          await request(app.getHttpServer())
            .post('/auth/mobile/register')
            .send(createUserPayload)
            .expect(201)

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
        const createUserPayload = createFakeUserPayload()

        await request(app.getHttpServer())
          .post('/auth/web/register')
          .send(createUserPayload)
          .expect(201)

        const response = await request(app.getHttpServer())
          .post('/auth/web/login')
          .send({
            email: createUserPayload.email,
            password: createUserPayload.password,
          })
          .expect(201);

        validateCookiesOnResponse(response.headers);
      });

      describe('with error', () => {
        it('with wrong email', async () => {
          const createUserPayload = createFakeUserPayload()

          await request(app.getHttpServer())
            .post('/auth/web/register')
            .send(createUserPayload)
            .expect(201)

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
          const createUserPayload = createFakeUserPayload();

          await request(app.getHttpServer())
            .post('/auth/web/register')
            .send(createUserPayload)
            .expect(201)

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
      const createUserPayload = createFakeUserPayload()

      const createUserResponse = await request(app.getHttpServer())
        .post('/auth/web/register')
        .send(createUserPayload)
        .expect(201)

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

      const refreshTokenCookie = extractCookiesFromRequest(
        logoutResponse.headers,
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
        const createUserPayload = createFakeUserPayload()

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

        const updateRefreshTokenUser = await userModel
          .findOne({
            email: createUserPayload.email,
          })
          .lean<IUser>();

        expect(oldRefreshTokenUser.refreshToken).not.toBe(
          updateRefreshTokenUser?.refreshToken,
        );
      });
    })
    describe('web', () => {
      it('POST /auth/web/refresh-token → deve atualizar o refresh-token', async () => {
        const createUserPayload = createFakeUserPayload()

        const registerUserResponse = await request(app.getHttpServer())
          .post('/auth/web/register')
          .send(createUserPayload)
          .expect(201);

        const oldRefreshTokenUser = (await userModel
          .findOne({
            email: createUserPayload.email,
          })
          .lean()) as IUser;

        const cookies = extractCookiesFromRequest(
          registerUserResponse.headers,
          'refresh_token',
        );

        const refreshCookie = extractRefreshTokenFromCookies(cookies)

        await request(app.getHttpServer())
          .post('/auth/web/refresh')
          .set('Cookie', refreshCookie)
          .expect(201);

        const updateRefreshTokenUser = await userModel
          .findOne({
            email: createUserPayload.email,
          })
          .lean()

        expect(oldRefreshTokenUser.refreshToken).toBeDefined();
        expect(updateRefreshTokenUser?.refreshToken).toBeDefined();
        expect(oldRefreshTokenUser.refreshToken).not.toBe(updateRefreshTokenUser?.refreshToken)
      });
    })
  });
});
