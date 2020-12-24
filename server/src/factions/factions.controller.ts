import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FactionsService } from './factions.service';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';

@Controller('factions')
export class FactionsController {
  constructor(private readonly factionsService: FactionsService) {}

  @Post()
  create(@Body() createFactionDto: CreateFactionDto) {
    return this.factionsService.create(createFactionDto);
  }

  @Get()
  findAll() {
    return this.factionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFactionDto: UpdateFactionDto) {
    return this.factionsService.update(id, updateFactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factionsService.remove(id);
  }
}
