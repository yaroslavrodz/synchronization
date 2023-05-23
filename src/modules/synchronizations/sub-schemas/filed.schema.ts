import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { FeatureDocument } from 'src/modules/features/feature.schema';

export type FieldDocument = HydratedDocument<Field>;

@Schema()
export class Field {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' })
  feature: FeatureDocument;

  @Prop({ type: String, required: true })
  source: string;

  @Prop({ type: String, required: true })
  required: boolean;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
