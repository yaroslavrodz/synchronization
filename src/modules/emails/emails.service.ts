import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Email } from './email.schema';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailsService {
  constructor(@InjectModel(Email.name) private emailModel: Model<Email>) {}

  async createMany(createEmailDtos: CreateEmailDto[]) {
    return await this.emailModel.insertMany(createEmailDtos);
  }

  async deleteBySynchronization(synchronization: Types.ObjectId) {
    return await this.emailModel.deleteMany({ synchronization });
  }
}
