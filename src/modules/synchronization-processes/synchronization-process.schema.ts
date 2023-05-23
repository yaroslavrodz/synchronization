import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { SynchronizationDocument } from '../synchronizations/synchronization.schema';
import { SynchronizationProcessStatus } from './enums/syncronizationProcessStatus.enum';

export type SynchronizationProcessDocument =
  HydratedDocument<SynchronizationProcess>;

@Schema()
export class SynchronizationProcess {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Synchronization' })
  synchronization: SynchronizationDocument;

  @Prop({
    type: String,
    enum: Object.values(SynchronizationProcessStatus),
    default: SynchronizationProcessStatus.PENDING,
  })
  status: SynchronizationProcessStatus;

  @Prop({ type: Number, default: 0 })
  datasetsCount: number;

  @Prop({ type: Number, default: 0 })
  processedDatasetsCount: number;

  @Prop({ type: Number, default: 0 })
  transferedDatasetsCount: number;

  @Prop([{ type: String }])
  log: string[];

  @Prop({ type: Number, default: 1 })
  attempts: number;

  @Prop({ type: String, required: false })
  errorMessage: string;
}

export const SynchronizationProcessSchema = SchemaFactory.createForClass(
  SynchronizationProcess,
);
