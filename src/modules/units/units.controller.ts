import { Body, Controller, Post } from '@nestjs/common';

import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async create(@Body() createUnitDto: CreateUnitDto) {
    return await this.unitsService.create(createUnitDto);
  }
}
