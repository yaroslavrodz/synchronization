import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  SynchronizationProcess,
  SynchronizationProcessSchema,
} from './synchronization-process.schema';
import { SynchronizationProcessesService } from './synchronization-processes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SynchronizationProcess.name,
        schema: SynchronizationProcessSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [SynchronizationProcessesService],
  exports: [SynchronizationProcessesService],
})
export class SynchronizationProcessesModule {}
