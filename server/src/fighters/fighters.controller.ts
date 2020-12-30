import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FightersService } from './fighters.service';
import { UpdateFighterDto } from './dto/update-fighter.dto';

@Controller('gangs/:gangId/fighters')
export class FightersController {
  constructor(private readonly fightersService: FightersService) {}

  @Get()
  findByGangId(@Param('gangId') gangId: string) {
    return this.fightersService.findByGangId(gangId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fightersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFighterDto: UpdateFighterDto) {
    return this.fightersService.update(id, updateFighterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fightersService.remove(id);
  }
}
