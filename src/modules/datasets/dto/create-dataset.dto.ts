import { Types } from 'mongoose';

import { CreateRecordDto } from 'src/modules/records/dto/create-record.dto';

export class CreateDatasetDto {
  readonly unit: Types.ObjectId;
  readonly synchronization?: Types.ObjectId;
  readonly sourceDatasetId?: string;
  readonly records: Omit<CreateRecordDto, 'dataset'>[];
}
