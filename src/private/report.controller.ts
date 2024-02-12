import { Controller, Get, Query } from '@nestjs/common';
import { ItemService } from '../services/item.service';
@Controller('report')
export class ReportController {
  constructor(private itemService: ItemService) {}

  @Get()
  async search(
    @Query('deleted') deleted: string,
    @Query('startDate') start: string,
    @Query('endDate') end: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ): Promise<object> {
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;
    const result = await this.itemService.generateReport({
      deleted: deleted === 'true',
      startDate,
      endDate,
      minPrice,
      maxPrice,
    });
    return { result };
  }

  @Get('/deleted')
  async searchDeleted(): Promise<object> {
    const result = await this.itemService.generateReport({
      deleted: true,
    });
    return { deletedItems: result };
  }

  @Get('/active')
  async searchActive(
    @Query('startDate') start: string,
    @Query('endDate') end: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ): Promise<object> {
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;
    const result = await this.itemService.generateReport({
      deleted: false,
      startDate,
      endDate,
      minPrice,
      maxPrice,
    });
    return { activeItems: `${result.toFixed(2)} %` };
  }
}
