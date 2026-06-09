import { AppModule } from './../../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');
import request = require('supertest');

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

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

      const { body } = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserPayload)
        .expect(201)

      expect(body.accessToken).toBeDefined();
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
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'O nome de usuário deve ter no máximo 16 caracteres',
            'O nome de usuário deve ter pelo menos 5 caracteres',
            'Nome de usuário é obrigátorio',
            'Formato inválido'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          })
        })

        it('with a non string username', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: faker.number.int({ min: 10_000, max: 20_000 }),
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'O nome de usuário deve ter no máximo 16 caracteres',
            'O nome de usuário deve ter pelo menos 5 caracteres',
            'Formato inválido'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          })
        })

        it('without minimal length', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: 'inva',
              password: faker.internet.password({ prefix: '1!Ab' }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'O nome de usuário deve ter pelo menos 5 caracteres'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          })
        })
      })

      describe('password', () => {
        it('with empty field', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
            'A senha deve ter no máximo 64 caracteres',
            'A senha deve ter no mínimo 8 caracteres',
            'Senha é obrigátoria',
            'Formato inválido'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
        it('with invalid type format', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.number.int({ min: 10_000, max: 20_000 }),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)',
            'A senha deve ter no máximo 64 caracteres',
            'A senha deve ter no mínimo 8 caracteres',
            'Formato inválido'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
        it('with invalid minimal length', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password({ prefix: '1!Ab', length: 6 }),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'A senha deve ter no mínimo 8 caracteres'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
        it('with invalid maximum lenght', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password({ prefix: '1!Ab', length: 65 }),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'A senha deve ter no máximo 64 caracteres'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
        it('with invalid pattern', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              password: faker.internet.password(),
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              email: faker.internet.email(),
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'A senha deve ter ao menos uma letra maiúsculas, minúsculas, número e caracter especial (@, $, !, %, ? ou &)'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
      })

      describe('email', () => {
        it('with empty field', async () => {
          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
              username: faker.word.verb({ length: { min: 5, max: 16 } }),
              password: faker.internet.password({ prefix: '1!Ab' })
            })
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'Email é obrigátorio',
            'Email deve ser válido'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
        it('with invalid format', async () => {
          const createUserPayload = {
            username: faker.word.verb({ length: { min: 5, max: 16 } }),
            password: faker.internet.password({ prefix: '1!Ab' }),
            email: faker.word.verb({ length: 16 })
          }

          const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserPayload)
            .expect(400)

          expect(body.error).toBe('Bad Request')

          const expectedErrors = [
            'Email deve ser válido'
          ]
          body.message.forEach((error: string) => {
            expect(expectedErrors).toContain(error)
          });
        })
      })
    })


  });

  // describe('login', () => {

  // });

  // describe('logout', () => {

  // });

  // describe('refresh', () => {

  // });
});
