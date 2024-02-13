import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './services/item.service';
import { ItemDtoPipe } from './pipes/item-dto.pipe';
import { Item } from './entities/item.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly itemService: ItemService,
    private readonly itemDtoPipe: ItemDtoPipe,
  ) {}
  private readonly logger = new Logger(AppService.name);

  @Cron('0 0 * * * *')
  handleCron() {
    this.logger.debug('Called every hour');
    this.populate();
  }

  populate() {
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
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=${process.env.CONTENT_TYPE}`,
    );
    return response;
  }
}
