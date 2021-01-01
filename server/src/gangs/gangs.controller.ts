import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GangsService } from './gangs.service';
import { CreateGangDto } from './dto/create-gang.dto';
import { UpdateGangDto } from './dto/update-gang.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('gangs')
export class GangsController {
  constructor(private readonly gangsService: GangsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGangDto: CreateGangDto, @Request() req) {
    const { id: userId } = req.user;
    return this.gangsService.create({ ...createGangDto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Request() req) {
    const { id: userId } = req.user;
    return this.gangsService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const { id: userId } = req.user;
    return this.gangsService.getGangDetail(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateGangDto: UpdateGangDto,
    @Request() req,
  ) {
    const { id: userId } = req.user;
    return this.gangsService.update(id, updateGangDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const { id: userId } = req.user;
    return this.gangsService.remove(id, userId);
  }
}
