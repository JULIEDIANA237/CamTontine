import { ApiProperty } from '@nestjs/swagger';
import { NotificationChannel } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty({ description: 'Identifiant UUID du destinataire' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'Titre de la notification', example: 'Appel de fonds tontine' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Contenu du message', example: 'Le cycle #2 est désormais ouvert.' })
    @IsString()
    message: string;

    @ApiProperty({ enum: NotificationChannel, description: 'Canal d’envoi' })
    @IsEnum(NotificationChannel)
    channel: NotificationChannel;
}
