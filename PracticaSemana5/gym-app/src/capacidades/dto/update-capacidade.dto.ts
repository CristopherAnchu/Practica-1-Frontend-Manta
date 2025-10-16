import { PartialType } from '@nestjs/mapped-types';
import { CreateCapacidadeDto } from './create-capacidade.dto';

export class UpdateCapacidadeDto extends PartialType(CreateCapacidadeDto) {}
