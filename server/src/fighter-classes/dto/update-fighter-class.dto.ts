import { PartialType } from '@nestjs/mapped-types';
import { CreateFighterClassDto } from './create-fighter-class.dto';

export class UpdateFighterClassDto extends PartialType(CreateFighterClassDto) {}
