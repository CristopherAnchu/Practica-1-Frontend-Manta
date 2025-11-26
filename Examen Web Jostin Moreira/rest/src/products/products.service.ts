import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domains/ecommerce/entities';
import { CreateProductDto, UpdateProductDto } from '@domains/ecommerce/dtos';
import { WebhookService } from '../websocket/webhook/webhook.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly webhookService: WebhookService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const saved = await this.productRepository.save(product);
    
    // Notificar via webhook
    await this.webhookService.notifyCreate('product', saved.id, saved);
    
    return saved;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['variations', 'customizations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variations', 'customizations'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    const updated = await this.productRepository.save(product);
    
    // Notificar via webhook
    await this.webhookService.notifyUpdate('product', updated.id, updated);
    
    return updated;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // Endpoint especializado: Obtener productos activos por categoría
  async findByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category, isActive: true },
      relations: ['variations', 'customizations'],
    });
  }
}
