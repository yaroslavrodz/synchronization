import { Types } from 'mongoose';

export class CreateFeatureDto {
  readonly name: string;
  readonly unit: Types.ObjectId;
}
