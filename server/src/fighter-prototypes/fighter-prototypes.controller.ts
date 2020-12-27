import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FighterPrototypesService } from './fighter-prototypes.service';
import { CreateFighterPrototypeDto } from './dto/create-fighter-prototype.dto';
import { UpdateFighterPrototypeDto } from './dto/update-fighter-prototype.dto';

@Controller('fighter-prototypes')
export class FighterPrototypesController {
  constructor(
    private readonly fighterPrototypesService: FighterPrototypesService,
  ) {}

  @Post()
  create(@Body() createFighterPrototypeDto: CreateFighterPrototypeDto) {
    return this.fighterPrototypesService.create(createFighterPrototypeDto);
  }

  @Get()
  findAll() {
    return this.fighterPrototypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fighterPrototypesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFighterPrototypeDto: UpdateFighterPrototypeDto,
  ) {
    return this.fighterPrototypesService.update(id, updateFighterPrototypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fighterPrototypesService.remove(id);
  }
}
