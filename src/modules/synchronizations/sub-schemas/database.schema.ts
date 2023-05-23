import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

interface IDatabaseTable {
  name: string;
  idColumn: string;
}

export type DatabaseDocument = HydratedDocument<Database>;

@Schema()
export class Database {
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  config: any;

  @Prop({
    type: {
      name: { type: String, required: true },
      idColumn: { type: String, required: true },
    },
  })
  table: IDatabaseTable;
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);
