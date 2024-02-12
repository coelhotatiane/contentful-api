import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { Item } from 'src/entities/item.entity';
import { ItemService } from './item.service';
import { ItemDtoPipe } from 'src/pipes/item-dto.pipe';

@Controller('users')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('/item')
  @UsePipes(new ItemDtoPipe())
  async createItem(@Body() item: Item) {
    return this.itemService.create(item);
  }

  @Get('/item/:id')
  getItem(@Param('id') id: string): Promise<Item> {
    console.log(id);
    return this.itemService.get(id);
  }
}
