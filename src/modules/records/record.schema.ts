import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Feature } from '../features/feature.schema';
import { Dataset } from '../datasets/dataset.schema';

export type RecordDocument = HydratedDocument<Record>;

@Schema()
export class Record {
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  value: any;

  @Prop({ type: Boolean, default: false, index: true })
  archived: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' })
  feature: Feature;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' })
  dataset: Dataset;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
