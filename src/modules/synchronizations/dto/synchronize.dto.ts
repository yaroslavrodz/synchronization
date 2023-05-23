import { Types } from 'mongoose';

export class SynchronizeDto {
  readonly synchronizationId?: Types.ObjectId;
  readonly synchronizationProcessId?: Types.ObjectId;
  readonly retry?: boolean;
}
