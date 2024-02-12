import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Item } from './item.entity';
import { Tag } from './tag.entity';

@Entity()
export class Metadata {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => Item, (item) => item.metadata)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToMany(() => Tag, (tag) => tag.metadata, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'metadata_tag',
    joinColumn: {
      name: 'metadata_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
