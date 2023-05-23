import { Types } from 'mongoose';

export class CreateRecordDto {
  readonly value: any;
  readonly feature: Types.ObjectId;
  readonly dataset: Types.ObjectId;
}
