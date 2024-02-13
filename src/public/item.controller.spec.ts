import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from '../services/item.service';
import { Item } from '../entities/item.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

const itemRepositoryMockFactory: () => MockType<Repository<Item>> = jest.fn(
  () => ({
    create: jest.fn((entity) => Promise.resolve(entity)),
    save: jest.fn((entity) => Promise.resolve(entity)),
    findOne: jest.fn((entity) => Promise.resolve(entity)),
    find: jest.fn().mockImplementation((query: FindManyOptions<Item>) => {
      const item = JSON.parse(JSON.stringify(query.where)) as Item;
      delete item.deleted_at;
      return Promise.resolve([item]);
    }),
    softDelete: jest.fn().mockImplementation(() =>
      Promise.resolve({
        affected: 1,
      }),
    ),
  }),
);

describe('ItemController', () => {
  let controller: ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: getRepositoryToken(Item),
          useFactory: itemRepositoryMockFactory,
        },
        ItemService,
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return an array of items', async () => {
      const mockItem = {
        sku: '123',
        name: '',
        brand: '',
        model: '',
        category: '',
        color: '',
        price: 0,
        currency: '',
        stock: 0,
      };
      const query = {
        ...mockItem,
        skip: 0,
      };
      const result = await controller.search(query);
      expect(result).toEqual([mockItem]);
    });
  });

  describe('deleteItem', () => {
    it('should return affected count', async () => {
      const id = '1';
      const result = await controller.deleteItem(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
