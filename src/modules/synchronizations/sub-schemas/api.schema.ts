import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { RequestMethod } from '../enums/request-type.enum';

export type ApiDocument = HydratedDocument<Api>;

@Schema()
export class Api {
  @Prop({
    type: String,
    enum: Object.values(RequestMethod),
    required: true,
  })
  method: RequestMethod;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: Object, required: false })
  headers?: object;

  @Prop({ type: Object, required: false })
  params?: object;

  @Prop({ type: Object, required: false })
  body?: object;

  @Prop({ type: String, required: true })
  idColumn: string;
}

export const ApiSchema = SchemaFactory.createForClass(Api);
