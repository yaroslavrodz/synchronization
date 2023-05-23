import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Feature } from './feature.schema';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(Feature.name) private featureModel: Model<Feature>,
  ) {}

  async create(createFeatureDto: CreateFeatureDto) {
    return await this.featureModel.create(createFeatureDto);
  }
}
