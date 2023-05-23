import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Unit } from './unit.schema';
import { CreateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<Unit>) {}

  async create(createUnitDto: CreateUnitDto) {
    return await this.unitModel.create(createUnitDto);
  }
}
