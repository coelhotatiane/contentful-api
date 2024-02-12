import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Item } from 'src/entities/item.entity';
import { ItemService } from '../services/item.service';
import { ItemDtoPipe } from 'src/pipes/item-dto.pipe';
import { FindManyOptions, UpdateResult } from 'typeorm';
import { FieldsDto } from 'src/dto/fields.dto';

@Controller('public')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('/item')
  @UsePipes(new ItemDtoPipe())
  async createItem(@Body() item: Item) {
    return this.itemService.create(item);
  }

  @Get('/item/:id')
  getItem(@Param('id') id: string): Promise<Item> {
    return this.itemService.get(id);
  }

  @Get('/item')
  search(
    @Query() query: FieldsDto & Pick<FindManyOptions, 'skip'>,
  ): Promise<Item[]> {
    const skip = query.skip;
    delete query.skip;
    return this.itemService.search(query, skip);
  }

  @Delete('/item/:id')
  async deleteItem(
    @Param('id') id: string,
  ): Promise<Pick<UpdateResult, 'affected'>> {
    const result = await this.itemService.softDelete(id);
    return { affected: result.affected };
  }
}
