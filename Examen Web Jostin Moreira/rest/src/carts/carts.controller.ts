import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from '@domains/ecommerce/dtos';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: Partial<CreateCartDto>) {
    return this.cartsService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }

  // Endpoints especializados
  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body() body: { productId: string; variationId: string; quantity: number; customizationData?: any },
  ) {
    return this.cartsService.addItem(id, body.productId, body.variationId, body.quantity, body.customizationData);
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.cartsService.removeItem(id, itemId);
  }

  @Delete(':id/clear')
  clearCart(@Param('id') id: string) {
    return this.cartsService.clearCart(id);
  }
}
