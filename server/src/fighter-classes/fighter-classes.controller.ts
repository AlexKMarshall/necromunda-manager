import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FighterClassesService } from './fighter-classes.service';
import { CreateFighterClassDto } from './dto/create-fighter-class.dto';
import { UpdateFighterClassDto } from './dto/update-fighter-class.dto';

@Controller('fighter-classes')
export class FighterClassesController {
  constructor(private readonly fighterClassesService: FighterClassesService) {}

  @Post()
  create(@Body() createFighterClassDto: CreateFighterClassDto) {
    return this.fighterClassesService.create(createFighterClassDto);
  }

  @Get()
  findAll() {
    return this.fighterClassesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fighterClassesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFighterClassDto: UpdateFighterClassDto,
  ) {
    return this.fighterClassesService.update(id, updateFighterClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fighterClassesService.remove(id);
  }
}
