import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@prisma/client';
import { BasicTontineDto } from '../../../common/dto/responses/basic-tontine.dto';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class InvitationResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ nullable: true })
    email: string | null;

    @ApiProperty({ nullable: true })
    phone: string | null;

    @ApiProperty()
    token: string;

    @ApiProperty({ enum: InvitationStatus })
    status: InvitationStatus;

    @ApiProperty()
    expiresAt: Date;

    @ApiProperty({ nullable: true })
    acceptedAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: () => BasicTontineDto })
    tontine: BasicTontineDto;

    @ApiProperty({ type: () => BasicUserDto })
    invitedBy: BasicUserDto;
}
