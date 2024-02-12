import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { SysLink } from './sys-link.entity';
import { Item } from './item.entity';

@Entity()
export class Sys {
  @PrimaryColumn()
  id: string;

  // @Column()
  // item_id: string;

  @OneToOne(() => Item, (item) => item.sys)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => SysLink, (link) => link.spaceSys, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'space_id' })
  space: SysLink;

  @ManyToOne(() => SysLink, (link) => link.environmentSys, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'environment_id' })
  environment: SysLink;

  @ManyToOne(() => SysLink, (link) => link.contentTypeSys, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'content_type_id' })
  content_type: SysLink;

  @Column()
  type: string;

  @Column()
  revision: number;

  @Column()
  locale: string;
}
