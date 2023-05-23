import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UnitDocument = HydratedDocument<Unit>;

@Schema()
export class Unit {
  @Prop({ type: String, required: true })
  name: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
