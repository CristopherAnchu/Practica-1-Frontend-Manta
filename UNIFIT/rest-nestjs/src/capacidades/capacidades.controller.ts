import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CapacidadesService } from './capacidades.service';
import { CreateCapacidadeDto } from './dto/create-capacidade.dto';
import { UpdateCapacidadeDto } from './dto/update-capacidade.dto';

@Controller('capacidades')
export class CapacidadesController {
  constructor(private readonly capacidadesService: CapacidadesService) {}

  @Post()
  create(@Body() createCapacidadeDto: CreateCapacidadeDto) {
    return this.capacidadesService.create(createCapacidadeDto);
  }

  @Get()
  findAll() {
    return this.capacidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capacidadesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapacidadeDto: UpdateCapacidadeDto) {
    return this.capacidadesService.update(id, updateCapacidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capacidadesService.remove(id);
  }
}
