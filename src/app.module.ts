import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UnitsModule } from './modules/units/units.module';
import { FeaturesModule } from './modules/features/features.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { RecordsModule } from './modules/records/records.module';
import { EmailsModule } from './modules/emails/emails.module';
import { SynchronizationsModule } from './modules/synchronizations/synchronizations.module';
import { SynchronizationProcessesModule } from './modules/synchronization-processes/synchronization-processes.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://yaroslavrodz:rHj14oOORNKfH5NW@cluster0.khhiqlb.mongodb.net/?retryWrites=true&w=majority',
    ),
    UnitsModule,
    FeaturesModule,
    DatasetsModule,
    RecordsModule,
    EmailsModule,
    SynchronizationsModule,
    SynchronizationProcessesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
