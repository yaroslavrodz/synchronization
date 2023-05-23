import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Record, RecordSchema } from './record.schema';
import { RecordsService } from './records.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
  ],
  controllers: [],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
