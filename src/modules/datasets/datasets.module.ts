import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Dataset, DatasetSchema } from './dataset.schema';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';
import { RecordsModule } from '../records/records.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]),
    RecordsModule,
  ],
  controllers: [DatasetsController],
  providers: [DatasetsService],
  exports: [DatasetsService],
})
export class DatasetsModule {}
