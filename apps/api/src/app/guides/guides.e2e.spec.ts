import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { RiotApiService } from '../riot-api/service/riot-api.service';
import { DataDragonTransformerService } from '../ddragon/data-dragon-transformer.service';
import { RiotApiFixtures } from '../__fixtures__/riot-api.fixtures';
import { Model } from 'mongoose';
import { IUser, User, UserDocument } from '../users/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { RIOT_SERVERS } from '../riot-api/utils/riot-api.constants';
import request = require('supertest');
import { AbilityOption, Guide } from './schema/guide.schema';

describe('Guides (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let guideModel: Model<Guide>;

  const mockGuidePayload = {
    title: 'Guia de Ahri Mid - Season 2026',
    createdBy: '64f1a2b3c4d5e6f7a8b9c0d1',
    introduction:
      'Ahri é uma campeã de mid lane focada em burst mágico e mobilidade através de Charme e Espírito da Raposa.',

    patchVersion: '14.13',

    champion: 'Ahri',
    role: 'Mid',

    // Runes
    runes: {
      primaryRune: '8100', // Dominação (Domination)
      primarySlots: {
        first: '8112', // Eletrocutar (Electrocute) - keystone
        second: '8143', // Impacto Repentino (Sudden Impact)
        third: '8138', // Coleção de Olhos (Eyeball Collection)
        fourth: '8106', // Caçador Supremo (Ultimate Hunter)
      },
      secondaryRune: '8200', // Feitiçaria (Sorcery)
      secondarySlots: {
        first: '8226', // Cinto de Mana (Manaflow Band)
        second: '8210', // Transcendência (Transcendence)
        third: '8237', // Chamuscar (Scorch)
      },
    },

    runesDescription:
      'Dominação como árvore primária garante dano explosivo, enquanto Feitiçaria complementa o poder mágico e sustain.',

    // Bonus
    bonusSlotOne: '5008',
    bonusSlotTwo: '5008',
    bonusSlotThree: '5001',
    bonusDescription:
      'Priorize poder de habilidade nos dois primeiros slots para maximizar o dano nas primeiras rotações de combos.',

    // Spells
    firstSpell: '4',
    secondSpell: '12',
    spellsDescription:
      'Chama garante segurança e potencial de kill, enquanto Teleporte ajuda no controle de mapa e trocas de rota.',

    // Items
    itemsBlock: [
      {
        itemRollName: 'Build Padrão',
        itemArray: [
          { id: '3157', description: 'Zhonyas Hourglass - defesa e follow-up' },
          {
            id: '3089',
            description: 'Chapéu do Arcanjo Rabadon - amplificação de dano',
          },
        ],
      },
      {
        itemRollName: 'Build Contra Tanques',
        itemArray: [
          { id: '3116', description: 'Cetro do Vazio - penetração mágica' },
        ],
      },
    ],
    itemsDescription:
      'A build padrão foca em burst e segurança, enquanto a build alternativa aumenta a penetração mágica contra times com muita resistência.',

    // Abilities Progression
    abilitiesProgression: {
      l1: AbilityOption.A,
      l2: AbilityOption.B,
      l3: AbilityOption.A,
      l4: AbilityOption.A,
      l5: AbilityOption.A,
      l6: AbilityOption.C,
      l7: AbilityOption.A,
      l8: AbilityOption.B,
      l9: AbilityOption.A,
      l10: AbilityOption.B,
      l11: AbilityOption.C,
      l12: AbilityOption.B,
      l13: AbilityOption.B,
      l14: AbilityOption.D,
      l15: AbilityOption.D,
      l16: AbilityOption.C,
      l17: AbilityOption.D,
      l18: AbilityOption.D,
    },
    abilitiesProgressionDescription:
      'Priorize a habilidade A (Bola de Fogo Enganosa) no máximo, seguida por B para trocas, deixando C para os pontos obrigatórios de ultimate.',

    threats: [
      {
        threat: 'Zed',
        description:
          'Zed pode dar all-in facilmente após o nível 6; mantenha distância e use Charme para interromper o combo dele.',
      },
      {
        threat: 'LeBlanc',
        description:
          'LeBlanc tem burst comparável; evite ficar exposta sem Espírito da Raposa disponível para escapar.',
      },
    ],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RiotApiService)
      .useFactory({
        factory: (transformer: DataDragonTransformerService) =>
          RiotApiFixtures.createMockedRiotApiService(transformer),
        inject: [DataDragonTransformerService],
      })
      .compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    guideModel = module.get<Model<Guide>>(getModelToken(Guide.name));

    await userModel.deleteMany();

    app = module.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  const registerValidUser = async (userOverride?: IUser) => {
    const createUserPayload: CreateUserDto = {
      username: faker.string.alpha(16),
      password: faker.internet.password({ prefix: '1!Ab' }),
      email: faker.internet.email(),
      ...userOverride,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserPayload)
      .expect(201);

    const updateQuery = {
      puuid: faker.string.alphanumeric(78),
      tagLine: faker.string.alphanumeric(5),
      gameName: faker.internet.userName(),
      server: RIOT_SERVERS.BR1,
    };

    const updatedUser = await userModel
      .findOneAndUpdate({ email: createUserPayload.email }, updateQuery, {
        returnDocument: 'after',
      })
      .select('+puuid server');

    return {
      user: updatedUser,
      accessToken: response.body.accessToken,
    };
  };

  describe('PATCH /guides', () => {
    it('should only update own guides', async () => {
      const user = await registerValidUser();
      const otherUser = await registerValidUser();

      const insertedGuide = await guideModel.insertOne({
        ...mockGuidePayload,
        createdBy: otherUser.user._id,
      });

      const title = faker.lorem.sentence({ max: 10, min: 1 });

      await request(app.getHttpServer())
        .patch(`/guides/${insertedGuide._id.toString()}`)
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send({ title })
        .expect(403);

      await request(app.getHttpServer())
        .patch(`/guides/${insertedGuide._id.toString()}`)
        .set('Authorization', `Bearer ${otherUser.accessToken}`)
        .send({ title })
        .expect(200);
    });
  });
});
