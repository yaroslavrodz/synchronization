import { Body, Controller, Post } from '@nestjs/common';

import { DatasetsService } from './datasets.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Post()
  async create(@Body() createDatasetDto: CreateDatasetDto) {
    return await this.datasetsService.create(createDatasetDto);
  }
}
