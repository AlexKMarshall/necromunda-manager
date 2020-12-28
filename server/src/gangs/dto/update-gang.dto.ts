import { PartialType } from '@nestjs/mapped-types';
import { CreateGangDto } from './create-gang.dto';

export class UpdateGangDto extends PartialType(CreateGangDto) {}
