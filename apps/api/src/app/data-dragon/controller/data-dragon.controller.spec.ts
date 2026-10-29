import { Test, TestingModule } from '@nestjs/testing';
import { DataDragonService } from '../service/data-dragon.service';
import { DataDragonController } from './data-dragon.controller';

describe('DataDragonController', () => {
  let controller: DataDragonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataDragonController],
      providers: [DataDragonService]
    }).compile();

    controller = module.get<DataDragonController>(DataDragonController);
  });

  // DEVE PEGAR O PATCH
  // DEVE TRAZER OS ASSETS
  // DEVE TRAZER TODOS OS DADOS DE UM CAMPEÃO
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
