import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PostingsService } from './postings.service';

@Controller('gangs/:gangId')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  @Get('/postings')
  fingByGangId(@Param('gangId') gangId: string) {
    return this.postingsService.findByGangId(gangId);
  }
}
