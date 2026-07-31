import { AppModule } from '../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { CreateUserDto, createUserSchema } from '@org/contracts';
import { ZodValidationPipe } from './zod-validation.pipe';
import z from 'zod';
import { CreateGuideDto, createGuideSchema } from '../guides/dto/guide/create-guide.dto';
import { AbilityOption } from '../guides/schema/abilities-progression.schema';
import mongoose from 'mongoose';

interface ValidationErrorResponse {
  message: Array<{
    path: string;
    message: string;
    code: string;
  }>;
}

describe('zod validation pipe', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('required field', () => {
    it('should throw error', () => {
      const validationPipe = new ZodValidationPipe(createUserSchema)
      const createUser: Partial<CreateUserDto> = {
        email: faker.internet.email(),
        password: faker.internet.password({ prefix: '1!Ab' }),
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(createUser);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;

      expect(response.message).toContainEqual({
        path: 'username',
        message: 'Formato inválido',
        code: 'invalid_type',
      });
    })
  })
  describe('incorrect type', () => {
    it('should throw error', () => {
      const validationPipe = new ZodValidationPipe(createUserSchema)
      const createUser = {
        email: faker.internet.email(),
        password: faker.internet.password({ prefix: '1!Ab' }),
        username: 123123123
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(createUser);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;

      expect(response.message).toContainEqual({
        path: 'username',
        message: 'Formato inválido',
        code: 'invalid_type',
      });
    })
  })
  describe('short string', () => {
    it('should throw error', () => {
      const validationPipe = new ZodValidationPipe(createUserSchema)
      const createUser = {
        email: faker.internet.email(),
        password: '1!Ab',
        username: faker.internet.userName()
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(createUser);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;

      expect(response.message).toContainEqual({
        path: 'password',
        message: 'A senha deve ter no mínimo 8 caracteres',
        code: 'too_small',
      });
    })
  })
  describe('below min value', () => {
    it('should throw error', () => {
      interface ICart {
        quantity: number,
        productId: string
      }

      const cartSchema = z.object({
        quantity: z.number().min(2, { error: 'Below minimun value' }),
        productId: z.string()

      }) satisfies z.ZodType<ICart>;

      type CartDto = z.infer<typeof cartSchema>

      const validationPipe = new ZodValidationPipe(cartSchema)
      const cart: CartDto = {
        productId: faker.string.uuid(),
        quantity: 1
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(cart);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;
      expect(response.message).toContainEqual({
        path: 'quantity',
        message: 'Below minimun value',
        code: 'too_small',
      });
    })
  })
  describe('invalid enum', () => {
    it('should throw error', () => {
      enum Color {
        Red,
        Blue
      }

      interface ICart {
        quantity: number,
        productId: string
        color: Color
      }

      const cartSchema = z.object({
        quantity: z.number().min(2, { error: 'Below minimun value' }),
        productId: z.string(),
        color: z.enum(Color, { error: 'Invalid color' })
      }) satisfies z.ZodType<ICart>;

      type CartDto = z.infer<typeof cartSchema>

      const validationPipe = new ZodValidationPipe(cartSchema)
      const cart = {
        productId: faker.string.uuid(),
        quantity: 3,
        color: 'Yellow'
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(cart);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;
      expect(response.message).toContainEqual({
        path: 'color',
        message: 'Invalid color',
        code: 'invalid_value',
      });
    })
  })
  describe('invalid email', () => {
    it('should throw error', () => {
      const validationPipe = new ZodValidationPipe(createUserSchema)
      const createUser: Partial<CreateUserDto> = {
        email: faker.string.alpha(10),
        password: faker.internet.password({ prefix: '1!Ab' }),
        username: faker.internet.userName()
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(createUser);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;

      expect(response.message).toContainEqual({
        path: 'email',
        message: 'Email deve ser válido',
        code: 'invalid_format',
      });
    })
  })
  describe('invalid ObjectId', () => {
    it('should throw error', () => {
      const validationPipe = new ZodValidationPipe(createGuideSchema)
      const createGuide: CreateGuideDto = {
        title: '',
        createdBy: '',
        introduction: '',
        patchVersion: '',
        champion: '',
        role: '',
        runes: {
          primaryRune: '1',
          primarySlots: {
            first: '1',
            second: '1',
            third: '1',
            fourth: '1',
          },
          secondaryRune: '1',
          secondarySlots: {
            first: '1',
            second: '1',
            third: '1',
            fourth: '1',
          }
        },
        runesDescription: '',
        bonusSlotOne: '',
        bonusSlotTwo: '',
        bonusSlotThree: '',
        bonusDescription: '',
        firstSpell: '',
        secondSpell: '',
        spellsDescription: '',
        itemsBlock: [],
        itemsDescription: '',
        abilitiesProgression: {
          l1: AbilityOption.A,
          l2: AbilityOption.A,
          l3: AbilityOption.A,
          l4: AbilityOption.A,
          l5: AbilityOption.A,
          l6: AbilityOption.A,
          l7: AbilityOption.A,
          l8: AbilityOption.A,
          l9: AbilityOption.A,
          l10: AbilityOption.A,
          l11: AbilityOption.A,
          l12: AbilityOption.A,
          l13: AbilityOption.A,
          l14: AbilityOption.A,
          l15: AbilityOption.A,
          l16: AbilityOption.A,
          l17: AbilityOption.A,
          l18: AbilityOption.A,
        },
        abilitiesProgressionDescription: '',
        threatsDescription: '',
        threats: [],
        createdAt: ''
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(createGuide);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;

      expect(response.message).toContainEqual({
        path: 'createdBy',
        message: 'ObjectId inválido',
        code: 'custom',
      });
    })
  })
  describe('Invalid array', () => {
    it('should throw error', () => {
      const validationPipe = new ZodValidationPipe(createGuideSchema)
      const createGuide = {
        title: '',
        createdBy: new mongoose.Types.ObjectId().toString(),
        introduction: '',
        patchVersion: '',
        champion: '',
        role: '',
        runes: {
          primaryRune: '1',
          primarySlots: {
            first: '1',
            second: '1',
            third: '1',
            fourth: '1',
          },
          secondaryRune: '1',
          secondarySlots: {
            first: '1',
            second: '1',
            third: '1',
            fourth: '1',
          }
        },
        runesDescription: '',
        bonusSlotOne: '',
        bonusSlotTwo: '',
        bonusSlotThree: '',
        bonusDescription: '',
        firstSpell: '',
        secondSpell: '',
        spellsDescription: '',
        itemsBlock: [],
        itemsDescription: '',
        abilitiesProgression: {
          l1: AbilityOption.A,
          l2: AbilityOption.A,
          l3: AbilityOption.A,
          l4: AbilityOption.A,
          l5: AbilityOption.A,
          l6: AbilityOption.A,
          l7: AbilityOption.A,
          l8: AbilityOption.A,
          l9: AbilityOption.A,
          l10: AbilityOption.A,
          l11: AbilityOption.A,
          l12: AbilityOption.A,
          l13: AbilityOption.A,
          l14: AbilityOption.A,
          l15: AbilityOption.A,
          l16: AbilityOption.A,
          l17: AbilityOption.A,
          l18: AbilityOption.A,
        },
        abilitiesProgressionDescription: '',
        threatsDescription: '',
        threats: [{}],
        createdAt: ''
      }

      let exception: BadRequestException;

      try {
        validationPipe.transform(createGuide);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        exception = error as BadRequestException;
      }

      const response = exception.getResponse() as ValidationErrorResponse;

      expect(response.message).toContainEqual({
        path: 'threats.0.threat',
        message: 'formato do campo é inválido',
        code: 'invalid_type',
      });

      expect(response.message).toContainEqual({
        path: 'threats.0.description',
        message: 'formato do campo é inválido',
        code: 'invalid_type',
      });
    })
  })
  describe('Invalid nest object', () => {
    const validationPipe = new ZodValidationPipe(createGuideSchema)
    const createGuide = {
      title: '',
      createdBy: new mongoose.Types.ObjectId().toString(),
      introduction: '',
      patchVersion: '',
      champion: '',
      role: '',
      runes: {
        primaryRune: '1',
        primarySlots: {
          first: '1',
          second: '1',
          third: '1',
          fourth: '1',
        },
        secondaryRune: '1',
        secondarySlots: {
          first: '1',
          second: '1',
          third: '1',
          fourth: '1',
        }
      },
      runesDescription: '',
      bonusSlotOne: '',
      bonusSlotTwo: '',
      bonusSlotThree: '',
      bonusDescription: '',
      firstSpell: '',
      secondSpell: '',
      spellsDescription: '',
      itemsBlock: [],
      itemsDescription: '',
      abilitiesProgression: {
        l1: 'F',
        l2: AbilityOption.A,
        l3: AbilityOption.A,
        l4: AbilityOption.A,
        l5: AbilityOption.A,
        l6: AbilityOption.A,
        l7: AbilityOption.A,
        l8: AbilityOption.A,
        l9: AbilityOption.A,
        l10: AbilityOption.A,
        l11: AbilityOption.A,
        l12: AbilityOption.A,
        l13: AbilityOption.A,
        l14: AbilityOption.A,
        l15: AbilityOption.A,
        l16: AbilityOption.A,
        l17: AbilityOption.A,
        l18: AbilityOption.A,
      },
      abilitiesProgressionDescription: '',
      threatsDescription: '',
      threats: [],
      createdAt: ''
    }

    let exception: BadRequestException;

    try {
      validationPipe.transform(createGuide);
      fail('Expected BadRequestException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      exception = error as BadRequestException;
    }

    const response = exception.getResponse() as ValidationErrorResponse;

    expect(response.message).toContainEqual({
      path: 'abilitiesProgression.l1',
      message: `Valor invalido. Deve ser um dos seguintes valores: ${AbilityOption.A},${AbilityOption.B},${AbilityOption.C} ou ${AbilityOption.D}`,
      code: 'invalid_value',
    });
  })
});
