import { Body, Controller, Post } from '@nestjs/common';

import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  async create(@Body() createFeatureDto: CreateFeatureDto) {
    return await this.featuresService.create(createFeatureDto);
  }
}
