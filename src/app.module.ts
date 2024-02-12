import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScheduleAPIService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from './item/item.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { ItemDtoPipe } from './pipes/item-dto.pipe';
import { ItemController } from './item/item.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ItemModule,
  ],
  controllers: [AppController, ItemController],
  providers: [ScheduleAPIService, ItemDtoPipe],
})
export class AppModule {}
