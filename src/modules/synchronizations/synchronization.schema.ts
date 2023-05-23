import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { UnitDocument } from '../units/unit.schema';
import { SynchronizationSource } from './enums/synchronization-source.enum';
import { Database, DatabaseSchema } from './sub-schemas/database.schema';
import { Api, ApiSchema } from './sub-schemas/api.schema';
import { Imap, ImapSchema } from './sub-schemas/imap.schema';
import { Field, FieldSchema } from './sub-schemas/filed.schema';

export type SynchronizationDocument = HydratedDocument<Synchronization>;

@Schema()
export class Synchronization {
  @Prop({
    type: String,
    enum: Object.values(SynchronizationSource),
    required: true,
  })
  source: SynchronizationSource;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit?: UnitDocument;

  @Prop({ type: DatabaseSchema, required: false })
  database?: Database;

  @Prop({ type: ApiSchema, required: false })
  api?: Api;

  @Prop({ type: ImapSchema, required: false })
  imap?: Imap;

  @Prop([{ type: FieldSchema, required: false }])
  fields?: Field[];
}

export const SynchronizationSchema =
  SchemaFactory.createForClass(Synchronization);
