import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Email, EmailSchema } from './email.schema';
import { EmailsService } from './emails.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
