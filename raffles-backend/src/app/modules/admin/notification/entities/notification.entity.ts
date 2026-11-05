import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from 'typeorm';
import type { Relation } from 'typeorm';

import { NotificationChannel, NotificationStatus, NotificationType } from '../enum/notification.enum';
import { Company } from '../../company/entities/company.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.SENT,
  })
  status: NotificationStatus;

  @Column({ type: 'jsonb', })
  data: Record<string, unknown>;

  @Column({ nullable: true })
  sendedAt?: string;

  @Column({ nullable: true })
  readedAt?: string;

  @Column()
  createdAt: string;

  @Column({ default: true })
  isVisible: boolean;

  @ManyToOne(() => User, (user) => user.notifications, { eager: true, })
  user: Relation<User>;
}