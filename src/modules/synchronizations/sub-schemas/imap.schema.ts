import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Config as ImapConfig } from 'imap';

export type ImapDocument = HydratedDocument<Imap>;

@Schema()
export class Imap {
  @Prop({
    type: {
      user: { type: String, required: true },
      password: { type: String, required: true },
      host: { type: String, required: true },
      port: { type: Number, required: true },
      tls: { type: Boolean, required: true },
    },
    required: true,
  })
  config: ImapConfig;
}

export const ImapSchema = SchemaFactory.createForClass(Imap);
