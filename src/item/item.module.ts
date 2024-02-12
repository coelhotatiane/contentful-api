import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { Metadata } from 'src/entities/metadata.entity';
import { MetadataTag } from 'src/entities/metadata-tag.entity';
import { Sys } from 'src/entities/sys.entity';
import { SysLink } from 'src/entities/sys-link.entity';
import { Item } from 'src/entities/item.entity';
import { ItemService } from './item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, Metadata, MetadataTag, Sys, SysLink, Item]),
  ],
  providers: [ItemService],
  controllers: [],
  exports: [ItemService],
})
export class ItemModule {}
