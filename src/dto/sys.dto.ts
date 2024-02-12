import { SysLinkDto } from './sys-link';

export class SysDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  space: SysLinkDto;
  environment: SysLinkDto;
  contentType: SysLinkDto;
  type: string;
  revision: number;
  locale: string;
}
