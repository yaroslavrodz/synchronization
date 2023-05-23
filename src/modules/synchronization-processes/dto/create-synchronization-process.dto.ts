import { Types } from 'mongoose';

export class CreateSynchronizationProcessDto {
  readonly synchronization: Types.ObjectId;
}
