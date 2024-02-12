import { Injectable, PipeTransform } from '@nestjs/common';
import { createHash } from 'crypto';
import { ItemDto } from 'src/dto/item.dto';
import { Item } from 'src/entities/item.entity';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
@Injectable()
export class ItemDtoPipe implements PipeTransform<ItemDto, DeepPartial<Item>> {
  transform(value: ItemDto): DeepPartial<Item> {
    const hash = createHash('sha1');
    for (const key in value.fields) {
      hash.update(value.fields[key].toString());
    }
    hash.update(value.sys.id);

    return {
      ...value.fields,
      sys: {
        id: value.sys.id,
        created_at: value.sys.createdAt,
        updated_at: value.sys.updatedAt,
        space: {
          id: value.sys.space.sys.id,
          type: value.sys.space.sys.type,
          link_type: value.sys.space.sys.linkType,
        },
        environment: {
          id: value.sys.environment.sys.id,
          type: value.sys.environment.sys.type,
          link_type: value.sys.environment.sys.linkType,
        },
        content_type: {
          id: value.sys.contentType.sys.id,
          type: value.sys.contentType.sys.type,
          link_type: value.sys.contentType.sys.linkType,
        },
        type: value.sys.type,
        revision: value.sys.revision,
        locale: value.sys.locale,
      },
      metadata: {
        tags: value.metadata.tags.map((value) => ({ value })),
      },
      hash: hash.digest('hex'),
    };
  }
}
