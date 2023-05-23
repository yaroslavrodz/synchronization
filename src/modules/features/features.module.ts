import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Feature, FeatureSchema } from './feature.schema';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }]),
  ],
  controllers: [FeaturesController],
  providers: [FeaturesService],
})
export class FeaturesModule {}
