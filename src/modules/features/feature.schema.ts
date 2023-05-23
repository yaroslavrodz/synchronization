import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { FeatureType } from './enums/feature-type.enum';
import { Unit } from '../units/unit.schema';

export type FeatureDocument = HydratedDocument<Feature>;

@Schema()
export class Feature {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: Object.values(FeatureType), required: true })
  type: FeatureType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit: Unit;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
