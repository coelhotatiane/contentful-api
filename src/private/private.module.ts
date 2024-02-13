import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { Metadata } from 'src/entities/metadata.entity';
import { MetadataTag } from 'src/entities/metadata-tag.entity';
import { Sys } from 'src/entities/sys.entity';
import { SysLink } from 'src/entities/sys-link.entity';
import { Item } from 'src/entities/item.entity';
import { ItemService } from '../services/item.service';
import { ReportController } from './report.controller';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, Metadata, MetadataTag, Sys, SysLink, Item]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  providers: [ItemService, AuthService],
  controllers: [ReportController, AuthController],
  exports: [ItemService],
})
export class PrivateItemModule {}
