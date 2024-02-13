import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { BrandReport, ItemService } from '../services/item.service';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from 'src/entities/item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

const itemRepositoryMockFactory: () => MockType<Repository<Item>> = jest.fn(
  () => ({
    count: jest.fn(() => 1),
  }),
);

describe('ItemController', () => {
  let controllerReport: ReportController;
  let controllerAuth: AuthController;
  let repositoryMock: MockType<Repository<Item>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'mocked-secret',
          signOptions: { expiresIn: '1s' },
        }),
      ],
      controllers: [ReportController, AuthController],
      providers: [
        {
          provide: getRepositoryToken(Item),
          useFactory: itemRepositoryMockFactory,
        },
        ItemService,
        AuthService,
      ],
    }).compile();

    controllerReport = module.get<ReportController>(ReportController);
    controllerAuth = module.get<AuthController>(AuthController);
    repositoryMock = module.get(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(controllerReport).toBeDefined();
  });

  it('should be defined', () => {
    expect(controllerAuth).toBeDefined();
  });

  describe('auth unauthorized', () => {
    it('should return an error for unauthorized login', async () => {
      const login = controllerAuth.signIn('invalidUser', undefined);
      await expect(login).rejects.toThrow(new UnauthorizedException());
    });
  });

  describe('auth authorized', () => {
    it('should return a token', async () => {
      const result = await controllerAuth.signIn('validUser', 'validPassword');
      expect(typeof result).toBe('object');
      expect(typeof result.token).toBe('string');
    });
  });

  describe('generateReport', () => {
    it('should return result obj', async () => {
      const result = await controllerReport.search(
        'false',
        '2024-10-10',
        '2024-10-10',
        0,
        1000,
      );
      expect(result).toEqual({ result: 100 });
    });
  });

  describe('generateReportByBrand', () => {
    it('should return report by brand', async () => {
      const mockedValue: BrandReport[] = [{ brand: 'Apple', total: '30' }];
      const execute = jest.fn().mockReturnValue(mockedValue);
      const groupBy = jest.fn(() => ({ execute }));
      const select = jest.fn(() => ({ groupBy }));
      repositoryMock.createQueryBuilder = jest.fn(() => ({ select }));
      const result = await controllerReport.generateReportByBrand();
      expect(result).toEqual(mockedValue);
    });
  });
});
