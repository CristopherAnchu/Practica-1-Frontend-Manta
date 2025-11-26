import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variation } from '@domains/ecommerce/entities';
import { CreateVariationDto, UpdateVariationDto } from '@domains/ecommerce/dtos';
import { WebhookService } from '../websocket/webhook/webhook.service';

@Injectable()
export class VariationsService {
  constructor(
    @InjectRepository(Variation)
    private readonly variationRepository: Repository<Variation>,
    private readonly webhookService: WebhookService,
  ) {}

  async create(createVariationDto: CreateVariationDto): Promise<Variation> {
    const variation = this.variationRepository.create(createVariationDto);
    const saved = await this.variationRepository.save(variation);
    
    await this.webhookService.notifyCreate('variation', saved.id, saved);
    
    return saved;
  }

  async findAll(): Promise<Variation[]> {
    return await this.variationRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Variation> {
    const variation = await this.variationRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!variation) {
      throw new NotFoundException(`Variación con ID ${id} no encontrada`);
    }

    return variation;
  }

  async update(id: string, updateVariationDto: UpdateVariationDto): Promise<Variation> {
    const variation = await this.findOne(id);
    Object.assign(variation, updateVariationDto);
    const updated = await this.variationRepository.save(variation);
    
    await this.webhookService.notifyUpdate('variation', updated.id, updated);
    
    return updated;
  }

  async remove(id: string): Promise<void> {
    const variation = await this.findOne(id);
    await this.variationRepository.remove(variation);
  }

  // Endpoint especializado: Obtener variaciones de un producto
  async findByProduct(productId: string): Promise<Variation[]> {
    return await this.variationRepository.find({
      where: { productId },
      relations: ['product'],
    });
  }
}
