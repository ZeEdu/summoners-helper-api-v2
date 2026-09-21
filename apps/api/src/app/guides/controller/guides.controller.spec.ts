import { faker } from '@faker-js/faker';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';

import { AbilityOption, CreateGuideDto, GuidePaginationDto, RIOT_SERVERS, UserDtoWithPuuid } from '@org/contracts';

import ResponseMappers from '../../response-mappers';
import { User, UserSchema } from '../../users/schema/user.schema';
import { Guide, GuideDocument, GuideSchema } from '../schema/guide.schema';
import { GuidesService } from '../service/guides.service';
import { GuidesController } from './guides.controller';

let mongodb: MongoMemoryServer;

describe('GuidesController', () => {
  let controller: GuidesController;
  let userModel: Model<User>;
  let guideModel: Model<GuideDocument>;

  let user: UserDtoWithPuuid;
  const mockGuidePayload: CreateGuideDto = {
    title: 'Guia de Ahri Mid - Season 2026',
    createdBy: '64f1a2b3c4d5e6f7a8b9c0d1',
    introduction: 'Ahri é uma campeã de mid lane focada em burst mágico e mobilidade através de Charme e Espírito da Raposa.',

    patchVersion: '14.13',

    champion: 'Ahri',
    role: 'Mid',

    // Runes

    // Bonus
    bonusSlotOne: '5008',
    bonusSlotTwo: '5008',
    bonusSlotThree: '5001',
    bonusDescription: 'Priorize poder de habilidade nos dois primeiros slots para maximizar o dano nas primeiras rotações de combos.',

    // Spells
    firstSpell: '4',
    secondSpell: '12',
    spellsDescription: 'Chama garante segurança e potencial de kill, enquanto Teleporte ajuda no controle de mapa e trocas de rota.',

    // Items
    itemsDescription: 'A build padrão foca em burst e segurança, enquanto a build alternativa aumenta a penetração mágica contra times com muita resistência.',

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
    abilitiesProgressionDescription: 'Priorize a habilidade A (Bola de Fogo Enganosa) no máximo, seguida por B para trocas, deixando C para os pontos obrigatórios de ultimate.',

    threats: [
      {
        threat: 'Zed',
        description: 'Zed pode dar all-in facilmente após o nível 6; mantenha distância e use Charme para interromper o combo dele.',
      },
      {
        threat: 'LeBlanc',
        description: 'LeBlanc tem burst comparável; evite ficar exposta sem Espírito da Raposa disponível para escapar.',
      },
    ],
    threatsDescription: 'lorem ipsum',
    createdAt: '2026-01-01',


    "primaryRune": "8100",
    "primarySlots": {
      "first": "8112",
      "second": "8126",
      "third": "8137",
      "fourth": "8105"
    },
    "primaryRuneDescription": "asdasdasd",
    "secondaryRune": "8300",
    "secondarySlots": {
      "first": "8304",
      "second": "8306",
      "third": "8321"
    },
    "secondaryRuneDescription": "asdasdasd",
    "items": [
      {
        "rowName": "asdasdasdasd",
        "itemsList": [
          {
            "itemId": "1001"
          }
        ],
        "description": "adasdasd"
      }
    ],
  };

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    guideModel.deleteMany();
    userModel.deleteMany();

    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuidesController],
      providers: [GuidesService],
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Guide.name, schema: GuideSchema },
        ]),
      ],
    }).compile();

    controller = module.get<GuidesController>(GuidesController);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    guideModel = module.get<Model<GuideDocument>>(getModelToken(Guide.name));

    await userModel.deleteMany();

    const savedUser = await new userModel({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      userPuuid: faker.string.alphanumeric(78),
      tagLine: faker.string.alphanumeric(5),
      gameName: faker.internet.userName(),
      server: RIOT_SERVERS.br1,
    }).save();

    user = ResponseMappers.userWithPuuid(savedUser)
  });

  describe('get', () => {
    it('should get one by id', async () => {
      const document = await guideModel.insertOne({
        ...mockGuidePayload,
        createdBy: user.id,
      });

      const result = await controller.getGuide(document.id);
      expect(result).toBeDefined();
    });

    describe('get with filter', () => {
      it('should get by title', async () => {
        const title = faker.lorem.sentence({ max: 10, min: 1 });
        await guideModel.insertOne({
          ...mockGuidePayload,
          title,
          createdBy: user.id,
        });

        const pagination: GuidePaginationDto = {
          title,
        };
        const result = await controller.getGuides(pagination);
        expect(result.guides).toBeDefined();
        expect(result.guides.length).toBeGreaterThanOrEqual(1);
      });
      it('should get by creator', async () => {
        await guideModel.insertOne({
          ...mockGuidePayload,
          createdBy: user.id,
        });

        const pagination: GuidePaginationDto = {
          createdBy: user.id,
        };
        const result = await controller.getGuides(pagination);
        expect(result.guides).toBeDefined();
        expect(result.guides.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('should create', async () => {
    await controller.createGuide(user, mockGuidePayload);

    const storedGuide = await guideModel.findOne({
      title: mockGuidePayload.title,
    });
    expect(storedGuide).toBeDefined();
  });

  it('should patch', async () => {
    const document = await guideModel.insertOne({
      ...mockGuidePayload,
      createdBy: user.id,
    });

    const patchPayload = {
      title: faker.lorem.sentence({ max: 10, min: 1 }),
    };

    const result = await controller.editGuide(
      document.id,
      patchPayload,
    );

    expect(result?.title).toEqual(patchPayload.title);

    const patchedGuide = await guideModel.findById(document._id);
    expect(patchedGuide?.title).toEqual(patchPayload.title);
  });

  it('should delete', async () => {
    const document = await guideModel.insertOne({
      ...mockGuidePayload,
      createdBy: user.id,
    });

    await controller.deleteGuide(document.id);

    const storedGuide = await guideModel.findById(document._id);
    expect(storedGuide).toBeNull();
  });
});
