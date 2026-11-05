import { IsString, IsOptional, IsNumber, IsEnum, IsObject, IsBoolean } from 'class-validator';
import { NotificationChannel, NotificationStatus, NotificationType } from '../enum/notification.enum';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @IsObject()
  data: Record<string, unknown>;

  @IsOptional()
  @IsString()
  sendedAt?: string;

  @IsOptional()
  @IsString()
  readedAt?: string;

  @IsString()
  createdAt: string;

  @IsBoolean()
  isVisible: boolean;

  @IsNumber()
  userId: number;
}
