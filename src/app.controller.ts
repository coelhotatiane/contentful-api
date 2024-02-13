import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}
  @Post('/populate')
  async populate() {
    this.appService.populate();
    return { message: 'Population task has started' };
  }
}
