import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './item/item.service';
import { ItemDtoPipe } from './pipes/item-dto.pipe';
import { Item } from './entities/item.entity';

@Injectable()
export class ScheduleAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly itemService: ItemService,
    private readonly itemDtoPipe: ItemDtoPipe,
  ) {}
  private readonly logger = new Logger(ScheduleAPIService.name);

  @Cron('0 0 * * * *')
  handleCron() {
    this.logger.debug('Called every hour');
    this.getItems()
      .pipe(
        map((response) =>
          response.data.items.map(
            (dto) => this.itemDtoPipe.transform(dto) as Partial<Item>,
          ),
        ),
      )
      .subscribe(async (items) => {
        for (const item of items) {
          try {
            await this.itemService.create(item);
          } catch (error) {}
        }
      });
  }

  getItems(): Observable<AxiosResponse<{ items: ItemDto[] }>> {
    const response = this.httpService.get(
      'https://cdn.contentful.com/spaces/9xs1613l9f7v/environments/master/entries?access_token=I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns&content_type=product',
    );
    return response;
  }
}
