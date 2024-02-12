import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { Item } from 'src/entities/item.entity';
import { FieldsDto } from 'src/dto/fields.dto';

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
    return this.itemRepository.find({ where: { deleted_at: null, ...query }, take: 5, skip });
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.itemRepository.softDelete({ id, deleted_at: null });
  }
}
