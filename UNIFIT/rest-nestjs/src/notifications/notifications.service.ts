import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  constructor(
    @InjectRepository(Notification) 
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll() {
    return `This action returns all notifications`;
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOneBy({id})
    if (!notification)
      throw new Error(`Notification with id ${id} not found`);
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepository.findOneBy({id})
    if (!notification)
      throw new Error(`Notification with id ${id} not found`);
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.notificationRepository.findOneBy({id});
  }

  async remove(id: string) {
    const notification = this.findOne(id);
    await this.notificationRepository.delete(id);
    return `This action removes a #${id} notification`;
  }
}
