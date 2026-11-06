import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';

import { date_AAAA_MM_DD } from '@/app/shared/utils/dates';

import { CreateNotificationDto } from './dto/create-notification.dto';

import { Notification } from './entities/notification.entity';
import { NotificationStatus, NotificationType } from './enum/notification.enum';
import { UpdateNotificationDto } from './dto/update-notification.dto';


@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      type: NotificationType.INFO,
      title: dto.title,
      message: dto.message,
      channel: dto.channel,
      status: NotificationStatus.SENT,
      data: dto.data,
      createdAt: date_AAAA_MM_DD(new Date()),
      user: { id: dto.userId },
    });

    return this.notificationRepository.save(notification);
  };

  // "LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:companyName, ' ', ''))", { companyName },

  async findByUser(idUser: number): Promise<Notification[]> {
    return this.notificationRepository
      .createQueryBuilder('n')
      .leftJoin('n.user', 'u')
      .select([
        'n.id',
        'n.type',
        'n.title',
        'n.message',
        'n.channel',
        'n.status',
        'n.data',
        'n.sendedAt',
        'n.readedAt',
        'n.createdAt',
        'n.isVisible',
      ])
      .where('n.isVisible = :isVisible', {
        isVisible: true,
      })
      .andWhere('u.id = :idUser', { idUser })
      .orderBy('n.id', 'DESC')
      .getMany();
  };

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });

    if (!notification) throw new NotFoundException(`Notificación #${id} no encontrada.`);

    return notification;
  }; 

  async update(id: number, dto: UpdateNotificationDto): Promise<Notification> {
    await this.notificationRepository.update(id, {
      ...(dto.sendedAt !== undefined && {
        sendedAt: dto.sendedAt,
      }),
      ...(dto.readedAt !== undefined && {
        readedAt: dto.readedAt,
      }),
    });

    return this.findOne(id);
  };

  async delete(id: number): Promise<Notification> {
    await this.notificationRepository.update(id, { isVisible: false });
    return this.findOne(id);
  };
}
