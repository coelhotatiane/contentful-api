import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Item } from 'src/entities/item.entity';

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
    return this.itemRepository.findOne({ where: { id } });
  }
}
