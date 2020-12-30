import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountTypesService } from './account-types.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Controller('account-types')
export class AccountTypesController {
  constructor(private readonly accountTypesService: AccountTypesService) {}

  @Post()
  create(@Body() createAccountTypeDto: CreateAccountTypeDto) {
    return this.accountTypesService.create(createAccountTypeDto);
  }

  @Get()
  findAll() {
    return this.accountTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountTypesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountTypeDto: UpdateAccountTypeDto,
  ) {
    return this.accountTypesService.update(id, updateAccountTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountTypesService.remove(id);
  }
}
