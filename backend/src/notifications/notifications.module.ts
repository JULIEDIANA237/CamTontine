import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationMapper } from './mappers/notification.mapper';
import { NotificationLoader } from './loaders/notification.loader';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationMapper, NotificationLoader],
  exports: [NotificationsService, NotificationMapper, NotificationLoader],
})
export class NotificationsModule {}
