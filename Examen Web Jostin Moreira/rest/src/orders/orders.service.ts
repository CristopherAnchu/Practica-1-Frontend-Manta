import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@domains/ecommerce/entities';
import { CreateOrderDto } from '@domains/ecommerce/dtos';
import { WebhookService } from '../websocket/webhook/webhook.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly webhookService: WebhookService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = this.orderRepository.create({
      ...createOrderDto,
      orderNumber,
    });
    
    const saved = await this.orderRepository.save(order);
    await this.webhookService.notifyCreate('order', saved.id, saved);
    
    return saved;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: Partial<CreateOrderDto>): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  // Endpoints especializados: Gestión de estados de orden
  async updateStatus(id: string, status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    const updated = await this.orderRepository.save(order);
    
    await this.webhookService.notifyUpdate('order-status', updated.id, { status: updated.status, order: updated });
    
    return updated;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }
}
