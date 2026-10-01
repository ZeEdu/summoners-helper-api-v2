import { Test, TestingModule } from '@nestjs/testing';
import { DataDragonController } from './data-dragon.controller';

describe('DataDragonController', () => {
  let controller: DataDragonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataDragonController],
    }).compile();

    controller = module.get<DataDragonController>(DataDragonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
