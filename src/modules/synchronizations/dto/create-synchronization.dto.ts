import { Types } from 'mongoose';

import { SynchronizationSource } from '../enums/synchronization-source.enum';
import { Database } from '../sub-schemas/database.schema';
import { Api } from '../sub-schemas/api.schema';
import { Imap } from '../sub-schemas/imap.schema';
import { Field } from '../sub-schemas/filed.schema';

export class CreateSynchronizationDto {
  readonly source: SynchronizationSource;
  readonly unit?: Types.ObjectId;
  readonly database?: Database;
  readonly api?: Api;
  readonly imap?: Imap;
  readonly fields?: Field[];
}
