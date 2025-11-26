import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomizationsService } from './customizations.service';
import { CreateCustomizationDto, UpdateCustomizationDto } from '@domains/ecommerce/dtos';

@Controller('customizations')
export class CustomizationsController {
  constructor(private readonly customizationsService: CustomizationsService) {}

  @Post()
  create(@Body() createCustomizationDto: CreateCustomizationDto) {
    return this.customizationsService.create(createCustomizationDto);
  }

  @Get()
  findAll() {
    return this.customizationsService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.customizationsService.findByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customizationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomizationDto: UpdateCustomizationDto) {
    return this.customizationsService.update(id, updateCustomizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customizationsService.remove(id);
  }
}
