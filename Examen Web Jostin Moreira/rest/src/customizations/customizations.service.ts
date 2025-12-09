import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customization } from '@domains/ecommerce/entities';
import { CreateCustomizationDto, UpdateCustomizationDto } from '@domains/ecommerce/dtos';
import { WebhookService } from '../websocket/webhook/webhook.service';

@Injectable()
export class CustomizationsService {
  constructor(
    @InjectRepository(Customization)
    private readonly customizationRepository: Repository<Customization>,
    private readonly webhookService: WebhookService,
  ) {}

  async create(createCustomizationDto: CreateCustomizationDto): Promise<Customization> {
    const customization = this.customizationRepository.create(createCustomizationDto);
    const saved = await this.customizationRepository.save(customization);
    
    await this.webhookService.notifyCreate('customization', saved.id, saved);
    
    return saved;
  }

  async findAll(): Promise<Customization[]> {
    return await this.customizationRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Customization> {
    const customization = await this.customizationRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!customization) {
      throw new NotFoundException(`Personalización con ID ${id} no encontrada`);
    }

    return customization;
  }

  async update(id: string, updateCustomizationDto: UpdateCustomizationDto): Promise<Customization> {
    const customization = await this.findOne(id);
    Object.assign(customization, updateCustomizationDto);
    const updated = await this.customizationRepository.save(customization);
    
    await this.webhookService.notifyUpdate('customization', updated.id, updated);
    
    return updated;
  }

  async remove(id: string): Promise<void> {
    const customization = await this.findOne(id);
    await this.customizationRepository.remove(customization);
  }

  // Endpoint especializado: Obtener personalizaciones de un producto
  async findByProduct(productId: string): Promise<Customization[]> {
    return await this.customizationRepository.find({
      where: { productId },
      relations: ['product'],
    });
  }
}
