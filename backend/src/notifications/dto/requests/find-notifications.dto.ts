import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindNotificationsDto {
    @ApiPropertyOptional({ description: 'Numéro de page', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: "Nombre d'éléments par page", default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({ enum: NotificationChannel, description: 'Filtrer par canal' })
    @IsOptional()
    @IsEnum(NotificationChannel)
    channel?: NotificationChannel;

    @ApiPropertyOptional({ enum: NotificationStatus, description: 'Filtrer par statut' })
    @IsOptional()
    @IsEnum(NotificationStatus)
    status?: NotificationStatus;

    @ApiPropertyOptional({ description: 'Filtrer les non lues uniquement' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    unreadOnly?: boolean;
}
