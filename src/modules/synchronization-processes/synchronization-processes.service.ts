import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { SynchronizationProcess } from './synchronization-process.schema';
import { CreateSynchronizationProcessDto } from './dto/create-synchronization-process.dto';

@Injectable()
export class SynchronizationProcessesService {
  constructor(
    @InjectModel(SynchronizationProcess.name)
    private synchronizationProcessModel: Model<SynchronizationProcess>,
  ) {}

  async create(
    createSynchronizationProcessesDto: CreateSynchronizationProcessDto,
  ) {
    return await this.synchronizationProcessModel.create(
      createSynchronizationProcessesDto,
    );
  }

  async findById(id: Types.ObjectId) {
    return await this.synchronizationProcessModel.findById(id);
  }
}
