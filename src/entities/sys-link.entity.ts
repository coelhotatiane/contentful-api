import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Sys } from './sys.entity';

@Entity()
export class SysLink {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  link_type: string;

  @OneToMany(() => Sys, (sys) => sys.space)
  spaceSys: Sys;

  @OneToMany(() => Sys, (sys) => sys.environment)
  environmentSys: Sys;

  @OneToMany(() => Sys, (sys) => sys.content_type)
  contentTypeSys: Sys;
}
