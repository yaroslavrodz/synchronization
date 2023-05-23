import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Synchronization,
  SynchronizationSchema,
} from './synchronization.schema';
import { SynchronizationsController } from './synchronizations.controller';
import { DatasetsModule } from '../datasets/datasets.module';
import { RecordsModule } from '../records/records.module';
import { EmailsModule } from '../emails/emails.module';
import { SynchronizationProcessesModule } from '../synchronization-processes/synchronization-processes.module';
import { SynchronizationsService } from './services/synchronizations.service';
import { DatabaseSynchronizationService } from './services/database-synchronization.service';
import { ApiSynchronizationService } from './services/api-synchronization.service';
import { ImapSynchronizationService } from './services/imap-synchronization.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Synchronization.name, schema: SynchronizationSchema },
    ]),
    DatasetsModule,
    RecordsModule,
    EmailsModule,
    SynchronizationProcessesModule,
  ],
  controllers: [SynchronizationsController],
  providers: [
    SynchronizationsService,
    DatabaseSynchronizationService,
    ApiSynchronizationService,
    ImapSynchronizationService,
  ],
})
export class SynchronizationsModule {}
