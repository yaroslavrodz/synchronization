import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Unit } from '../units/unit.schema';
import { Synchronization } from '../synchronizations/synchronization.schema';

export type DatasetDocument = HydratedDocument<Dataset>;

@Schema()
export class Dataset {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit: Unit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Synchronization' })
  synchronization: Synchronization;

  @Prop({ type: String, required: false })
  sourceDatasetId: string;
}

export const DatasetSchema = SchemaFactory.createForClass(Dataset);
