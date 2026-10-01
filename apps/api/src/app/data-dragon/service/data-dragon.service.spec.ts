import { Test, TestingModule } from '@nestjs/testing';
import { DataDragonService } from './data-dragon.service';

describe('DataDragonService', () => {
  let service: DataDragonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataDragonService],
    }).compile();

    service = module.get<DataDragonService>(DataDragonService);
  });

  it('should be defined', async () => {
    const response = await service.getAssets()
    expect(response).toHaveProperty('data')
    expect(response).toHaveProperty('version')

    expect(response.data).toHaveProperty('lists')
    expect(response.data).toHaveProperty('maps')

    expect(response.data.lists).toHaveProperty('champions')
    expect(response.data.lists).toHaveProperty('runes')
    expect(response.data.lists).toHaveProperty('spells')
    expect(response.data.lists).toHaveProperty('items')

    expect(response.data.maps).toHaveProperty('champions')
    expect(response.data.maps).toHaveProperty('runes')
    expect(response.data.maps).toHaveProperty('spells')
    expect(response.data.maps).toHaveProperty('items')
  });
});
