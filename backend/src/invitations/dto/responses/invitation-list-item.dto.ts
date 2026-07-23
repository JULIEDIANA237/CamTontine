import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@prisma/client';

export class InvitationListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ nullable: true })
    email: string | null;

    @ApiProperty({ nullable: true })
    phone: string | null;

    @ApiProperty({ enum: InvitationStatus })
    status: InvitationStatus;

    @ApiProperty()
    expiresAt: Date;

    @ApiProperty()
    createdAt: Date;
}
