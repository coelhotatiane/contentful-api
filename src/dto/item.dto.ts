import { FieldsDto } from './fields.dto';
import { MetadataDto } from './metadata.dto';
import { SysDto } from './sys.dto';

export class ItemDto {
  metadata: MetadataDto;
  sys: SysDto;
  fields: FieldsDto;
}
