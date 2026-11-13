import { faker } from "@faker-js/faker";
import { BadRequestException } from "@nestjs/common";
import { CreateReportDto, createReportSchema, CreateUserDto, createUserSchema, REPORT_REASON, UpdateUserProfileDto, updateUserProfileSchema, VALIDATION_ERROR_KEYS } from "@org/contracts";
import { I18nContext } from "nestjs-i18n";

import TestsHelpers from '../../app/helpers/tests.helpers';
import { ZodValidationPipe } from "./zod-validation.pipe";

interface ResponseError {
  message: any[],
  error: string,
  statusCode: 400
}

function isResponseError(response: any): response is ResponseError {
  const hasMessageProperty = Object.hasOwn(response, 'message')
  const hasErrorProperty = Object.hasOwn(response, 'error')
  const hasStatusCodeProperty = Object.hasOwn(response, 'statusCode')

  return hasMessageProperty && hasErrorProperty && hasStatusCodeProperty
}

function parseException(exception: BadRequestException): ResponseError | undefined {
  const response = exception.getResponse()
  if (isResponseError(response)) {
    return response
  }

  return undefined
}

function getFirstMessage(responseError: ResponseError): string | undefined {
  return responseError.message[0].message
}

describe('zod validation pipe', () => {
  const createExpectedMessage = (key: string) => `translated:${key}`
  const t = jest.fn(createExpectedMessage)

  const i18nContext = {
    lang: 'pt',
    t,
  } as unknown as I18nContext

  describe('email', () => {
    it('should catch error', () => {
      const validationPipe = new ZodValidationPipe(createUserSchema);

      const createUser: Partial<CreateUserDto> = {
        email: faker.internet.userName(),
        username: faker.internet.userName(),
        password: TestsHelpers.validPassword,
      };

      I18nContext.create(i18nContext, () => {
        let exception: BadRequestException;

        try {
          validationPipe.transform(createUser);
          fail('Expected BadRequestException to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          exception = error as BadRequestException;
        }

        const parsedResponse = parseException(exception)
        const message = parsedResponse && getFirstMessage(parsedResponse)
        expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.email))
      })

      expect(t).toHaveBeenCalled()
    })
  })

  describe('string', () => {
    describe('format', () => {
      it('should catch error', () => {
        const validationPipe = new ZodValidationPipe(createUserSchema);

        const createUser: Partial<CreateUserDto & { username: any }> = {
          email: faker.internet.email(),
          username: 123123,
          password: TestsHelpers.validPassword,
        };

        I18nContext.create(i18nContext, () => {
          let exception: BadRequestException;

          try {
            validationPipe.transform(createUser);
            fail('Expected BadRequestException to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            exception = error as BadRequestException;
          }

          const parsedResponse = parseException(exception)
          const message = parsedResponse && getFirstMessage(parsedResponse)
          expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.type))
        })

        expect(t).toHaveBeenCalled()
      })
    })

    describe('min', () => {
      it('should catch error', () => {
        const validationPipe = new ZodValidationPipe(createUserSchema);

        const createUser: Partial<CreateUserDto> = {
          email: faker.internet.email(),
          username: faker.string.alpha({ length: { min: 3, max: 5 } }),
          password: TestsHelpers.validPassword,
        };

        I18nContext.create(i18nContext, () => {
          let exception: BadRequestException;

          try {
            validationPipe.transform(createUser);
            fail('Expected BadRequestException to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            exception = error as BadRequestException;
          }

          const parsedResponse = parseException(exception)
          const message = parsedResponse && getFirstMessage(parsedResponse)
          expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.stringMin))
        })

        expect(t).toHaveBeenCalled()
      })
    })

    describe('max', () => {
      it('should catch error', () => {
        const validationPipe = new ZodValidationPipe(createUserSchema);

        const createUser: Partial<CreateUserDto> = {
          email: faker.internet.email(),
          username: faker.string.alpha({ length: { min: 65, max: 65 } }),
          password: TestsHelpers.validPassword,
        };

        I18nContext.create(i18nContext, () => {
          let exception: BadRequestException;

          try {
            validationPipe.transform(createUser);
            fail('Expected BadRequestException to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            exception = error as BadRequestException;
          }

          const parsedResponse = parseException(exception)
          const message = parsedResponse && getFirstMessage(parsedResponse)
          expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.stringMax))
        })

        expect(t).toHaveBeenCalled()
      })
    })
  })

  describe('regex', () => {
    describe('password', () => {
      it('should catch error', () => {
        const validationPipe = new ZodValidationPipe(createUserSchema);
        const createUser: Partial<CreateUserDto> = {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: 'a'.repeat(128),
        };

        I18nContext.create(i18nContext, () => {
          let exception: BadRequestException;

          try {
            validationPipe.transform(createUser);
            fail('Expected BadRequestException to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            exception = error as BadRequestException;
          }

          const parsedResponse = parseException(exception)
          const message = parsedResponse && getFirstMessage(parsedResponse)

          expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.passwordPattern))
        })

        expect(t).toHaveBeenCalled()
      })
    })
  })

  describe('enum', () => {
    describe('server', () => {
      it('should catch error', () => {
        const validationPipe = new ZodValidationPipe(updateUserProfileSchema);
        const createUser: Omit<UpdateUserProfileDto, 'server'> & { server: string } = {
          gameName: faker.internet.userName(),
          tagLine: faker.internet.userName(),
          server: 'invalid-enum',
        };

        I18nContext.create(i18nContext, () => {
          let exception: BadRequestException;

          try {
            validationPipe.transform(createUser);
            fail('Expected BadRequestException to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            exception = error as BadRequestException;
          }

          const parsedResponse = parseException(exception)
          const message = parsedResponse && getFirstMessage(parsedResponse)

          expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.invalid))
        })

        expect(t).toHaveBeenCalled()
      })
    })
  })

  describe('refine', () => {
    describe('report target', () => {
      it('should catch error', () => {
        const validationPipe = new ZodValidationPipe(createReportSchema);
        const createReport: Omit<CreateReportDto, 'guide' | 'comment'> = {
          reason: REPORT_REASON.ADVERTISING,
          observation: faker.lorem.sentences(2),
        };

        I18nContext.create(i18nContext, () => {
          let exception: BadRequestException;

          try {
            validationPipe.transform(createReport);
            fail('Expected BadRequestException to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            exception = error as BadRequestException;
          }

          const parsedResponse = parseException(exception)
          const message = parsedResponse && getFirstMessage(parsedResponse)

          expect(message).toBe(createExpectedMessage(VALIDATION_ERROR_KEYS.reportTargetRequired))
        })

        expect(t).toHaveBeenCalled()
      })
    })
  })
});
