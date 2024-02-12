import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Sys } from './sys.entity';
import { Metadata } from './metadata.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column()
  price: number;

  @Column()
  currency: string;

  @Column()
  stock: number;

  @Index({ unique: true })
  @Column()
  hash: string;

  @OneToOne(() => Sys, (sys) => sys.item, { eager: true, cascade: ['insert'] })
  sys: Sys;

  @OneToOne(() => Metadata, (metadata) => metadata.item, {
    eager: true,
    cascade: ['insert'],
  })
  metadata: Metadata;

  @DeleteDateColumn()
  deleted_at: Date;
}
