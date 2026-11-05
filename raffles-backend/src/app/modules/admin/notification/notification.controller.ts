import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user/:idUser')
  findByUser(@Param('idUser') idUser: number) {
    return this.notificationService.findByUser(idUser);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateNotificationDto) {
    return this.notificationService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.notificationService.delete(id);
  }
}
