import { Types } from 'mongoose';

export class CreateEmailDto {
  readonly from?: string;
  readonly to: string[];
  readonly subject?: string;
  readonly text?: string;
  readonly html?: string;
  readonly date?: Date;
  readonly synchronization: Types.ObjectId;
}
