import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Metadata } from './metadata.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  value: string;

  @ManyToMany(() => Metadata, (metadata) => metadata.tags)
  metadata: Metadata[];
}
