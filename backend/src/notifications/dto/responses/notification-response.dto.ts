import { ApiProperty } from '@nestjs/swagger';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class NotificationResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty({ enum: NotificationChannel })
    channel: NotificationChannel;

    @ApiProperty({ enum: NotificationStatus })
    status: NotificationStatus;

    @ApiProperty({ nullable: true })
    sentAt: Date | null;

    @ApiProperty({ nullable: true })
    readAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: () => BasicUserDto })
    user: BasicUserDto;
}
