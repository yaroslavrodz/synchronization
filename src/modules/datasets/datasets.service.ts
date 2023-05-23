import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Dataset } from './dataset.schema';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { RecordsService } from '../records/records.service';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel(Dataset.name) private datasetModel: Model<Dataset>,
    private recordsService: RecordsService,
  ) {}

  async create(createDatasetDto: CreateDatasetDto) {
    const dataset = await this.datasetModel.create(createDatasetDto);
    const recordsToCreate = createDatasetDto.records.map((record) => {
      return {
        ...record,
        dataset: dataset._id,
      };
    });
    await this.recordsService.createMany(recordsToCreate);

    return dataset;
  }

  async findBySourceDatasetId(id: string) {
    return await this.datasetModel.findOne({
      sourceDatasetId: id,
    });
  }
}
