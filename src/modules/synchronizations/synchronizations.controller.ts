import { Body, Controller, Post } from '@nestjs/common';

import { CreateSynchronizationDto } from './dto/create-synchronization.dto';
import { SynchronizeDto } from './dto/synchronize.dto';
import { SynchronizationsService } from './services/synchronizations.service';

@Controller('synchronizations')
export class SynchronizationsController {
  constructor(
    private readonly synchronizationsService: SynchronizationsService,
  ) {}

  @Post()
  async create(@Body() createSynchronizationDto: CreateSynchronizationDto) {
    return await this.synchronizationsService.create(createSynchronizationDto);
  }

  @Post('synchronize')
  async synchronize(@Body() synchronizeDto: SynchronizeDto) {
    return await this.synchronizationsService.synchronize(synchronizeDto);
  }
}
