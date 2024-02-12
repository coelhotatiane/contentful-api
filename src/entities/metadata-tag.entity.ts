import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MetadataTag {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  metadata_id: string;

  @Column()
  tag_id: string;
}
