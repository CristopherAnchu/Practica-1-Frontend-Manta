import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from '@domains/ecommerce/entities';
import { CreateCartDto } from '@domains/ecommerce/dtos';
import { WebhookService } from '../websocket/webhook/webhook.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly webhookService: WebhookService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create(createCartDto);
    return await this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: ['items', 'items.variation', 'items.variation.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.variation', 'items.variation.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }

    return cart;
  }

  async update(id: string, updateCartDto: Partial<CreateCartDto>): Promise<Cart> {
    const cart = await this.findOne(id);
    Object.assign(cart, updateCartDto);
    return await this.cartRepository.save(cart);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }

  // Endpoints especializados: Gestión de items del carrito
  async addItem(cartId: string, productId: string, variationId: string, quantity: number, customizationData?: any): Promise<Cart> {
    const cart = await this.findOne(cartId);

    const cartItem = this.cartItemRepository.create({
      cartId,
      productId,
      variationId,
      quantity,
      customizationData,
      unitPrice: 0,
      customizationTotal: 0,
      itemTotal: 0,
    });

    const saved = await this.cartItemRepository.save(cartItem);
    await this.webhookService.notifyCreate('cart-item', saved.id, { cartId, item: saved });
    
    return this.findOne(cartId);
  }

  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.findOne(cartId);
    const item = cart.items.find(i => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Item con ID ${itemId} no encontrado en el carrito`);
    }

    await this.cartItemRepository.remove(item);
    return this.findOne(cartId);
  }

  async clearCart(cartId: string): Promise<Cart> {
    const cart = await this.findOne(cartId);
    await this.cartItemRepository.remove(cart.items);
    return this.findOne(cartId);
  }
}
