import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';

import { RIOT_SERVERS } from '@org/contracts';

import { GuidesController } from './guides.controller';
import { User, UserSchema } from '../../users/schema/user.schema';
import { AbilityOption, Guide, GuideSchema } from '../schema/guide.schema';
import { GuidesService } from '../service/guides.service';
import { GuidePaginationDto } from '../dto/pagination-guides.dto';

let mongodb: MongoMemoryServer;

describe('GuidesController', () => {
  let controller: GuidesController;
  let userModel: Model<User>;
  let guideModel: Model<Guide>;

  let user: User;
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
    guideModel = module.get<Model<Guide>>(getModelToken(Guide.name));

    await userModel.deleteMany();

    const savedUser = await new userModel({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      userPuuid: faker.string.alphanumeric(78),
      tagLine: faker.string.alphanumeric(5),
      gameName: faker.internet.userName(),
      server: RIOT_SERVERS.BR1,
    }).save();

    user = savedUser.toJSON();
  });

  describe('get', () => {
    it('should get one by id', async () => {
      const document = await guideModel.insertOne({
        ...mockGuidePayload,
        createdBy: user._id.toString(),
      });

      const result = await controller.getGuide(document._id.toString());
      expect(result).toBeDefined();
    });

    describe('get with filter', () => {
      it('should get by title', async () => {
        const title = faker.lorem.sentence({ max: 10, min: 1 });
        await guideModel.insertOne({
          ...mockGuidePayload,
          title,
          createdBy: user._id.toString(),
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
          createdBy: user._id.toString(),
        });

        const pagination: GuidePaginationDto = {
          createdBy: user._id.toString(),
        };
        const result = await controller.getGuides(pagination);
        expect(result.guides).toBeDefined();
        expect(result.guides.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('should create', async () => {
    await controller.createGuide({
      ...mockGuidePayload,
      createdBy: user._id.toString(),
    });

    const storedGuide = await guideModel.findOne({
      title: mockGuidePayload.title,
    });
    expect(storedGuide).toBeDefined();
  });

  it('should patch', async () => {
    const document = await guideModel.insertOne({
      ...mockGuidePayload,
      createdBy: user._id.toString(),
    });

    const patchPayload = {
      title: faker.lorem.sentence({ max: 10, min: 1 }),
    };

    const result = await controller.editGuide(
      document._id.toString(),
      patchPayload,
    );

    expect(result?.title).toEqual(patchPayload.title);

    const patchedGuide = await guideModel.findById(document._id);
    expect(patchedGuide?.title).toEqual(patchPayload.title);
  });

  it('should delete', async () => {
    const document = await guideModel.insertOne({
      ...mockGuidePayload,
      createdBy: user._id.toString(),
    });

    await controller.deleteGuide(document._id.toString());

    const storedGuide = await guideModel.findById(document._id);
    expect(storedGuide).toBeNull();
  });
});
