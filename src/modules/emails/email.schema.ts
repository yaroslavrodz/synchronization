import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';
import { Synchronization } from '../synchronizations/synchronization.schema';

export type EmailDocument = HydratedDocument<Email>;

export interface IEmail {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: Date;
  synchronization: Synchronization;
}

@Schema()
export class Email {
  @Prop({ type: String, required: false })
  from?: string;

  @Prop([{ type: String }])
  to: string[];

  @Prop({ type: String, required: false })
  subject?: string;

  @Prop({ type: String, required: false })
  text?: string;

  @Prop({ type: String, required: false })
  html?: string;

  @Prop({ type: Date, required: false })
  date?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Synchronization' })
  synchronization: Synchronization;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
