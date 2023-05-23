import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Record } from './record.schema';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordsService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

  async createMany(createRecordDtos: CreateRecordDto[]) {
    return await this.recordModel.insertMany(createRecordDtos);
  }

  async archiveRecords(dataset: Types.ObjectId) {
    return await this.recordModel.updateMany({ dataset }, { archived: true });
  }
}
