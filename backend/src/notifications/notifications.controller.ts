import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  ApiAuth,
  ApiCreated,
  ApiPagination,
  ApiStandardResponses,
  ApiUpdated,
} from '../common/swagger';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/requests/create-notification.dto';
import { FindNotificationsDto } from './dto/requests/find-notifications.dto';
import { NotificationResponseDto } from './dto/responses/notification-response.dto';
import { NotificationListItemDto } from './dto/responses/notification-list-item.dto';

@ApiTags('Notifications')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer / Envoyer une notification',
  })
  @ApiCreated(
    NotificationResponseDto,
    'Notification créée avec succès.',
  )
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les notifications de l’utilisateur connecté',
  })
  @ApiPagination(
    NotificationListItemDto,
    'Liste paginée des notifications.',
  )
  findAll(@Request() req: any, @Query() query: FindNotificationsDto) {
    const userId = req.user.id;
    return this.notificationsService.findAllForUser(userId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir les détails d’une notification',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de la notification',
  })
  @ApiUpdated(
    NotificationResponseDto,
    'Notification récupérée avec succès.',
  )
  findOne(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.user.id;
    return this.notificationsService.findOne(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Marquer toutes les notifications comme lues',
  })
  markAllAsRead(@Request() req: any) {
    const userId = req.user.id;
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marquer une notification comme lue',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de la notification',
  })
  markAsRead(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.user.id;
    return this.notificationsService.markAsRead(id, userId);
  }
}
