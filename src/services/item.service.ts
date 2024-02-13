import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Item } from 'src/entities/item.entity';
import { FieldsDto } from 'src/dto/fields.dto';

export interface ReportParams {
  deleted?: boolean;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
}

export interface BrandReport {
  brand: string;
  total: string;
}

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItem: Partial<Item>): Promise<Item> {
    try {
      const data = this.itemRepository.create(createItem);
      return this.itemRepository.save(data);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate')) {
          throw new HttpException('Duplicate item', HttpStatus.CONFLICT);
        } else {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
      throw error;
    }
  }

  get(id: string): Promise<Item> {
    return this.itemRepository.findOne({ where: { id, deleted_at: null } });
  }

  search(query: FieldsDto, skip: FindManyOptions['skip']) {
    return this.itemRepository.find({
      where: { deleted_at: null, ...query },
      take: 5,
      skip,
    });
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.itemRepository.softDelete({ id, deleted_at: null });
  }

  async generateReport({
    deleted,
    startDate,
    endDate,
    minPrice,
    maxPrice,
  }: ReportParams): Promise<number> {
    const deleted_at = deleted ? Not(IsNull()) : null;
    const created_at =
      startDate && endDate
        ? Between(startDate, endDate)
        : startDate && !endDate
          ? MoreThan(startDate)
          : !startDate && endDate
            ? LessThan(endDate)
            : undefined;

    const price =
      minPrice && maxPrice
        ? Between(minPrice, maxPrice)
        : minPrice && !maxPrice
          ? MoreThan(minPrice)
          : !minPrice && maxPrice
            ? LessThan(maxPrice)
            : undefined;

    const count = await this.itemRepository.count({
      where: { deleted_at, sys: { created_at }, price },
      withDeleted: deleted,
    });
    const total = await this.itemRepository.count({ withDeleted: deleted });
    return (count / total) * 100;
  }

  async generateReportByBrand(): Promise<BrandReport[]> {
    const result = await this.itemRepository
      .createQueryBuilder('item')
      .select('item.brand, COUNT(*) AS total')
      .groupBy('item.brand')
      .execute();
    return result;
  }
}
