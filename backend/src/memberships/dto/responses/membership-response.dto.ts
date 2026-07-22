import { ApiProperty } from '@nestjs/swagger';

import {
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';
import { BasicTontineDto } from '../../../common/dto/responses/basic-tontine.dto';

export class MembershipResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        type: () => BasicUserDto,
    })
    user: BasicUserDto;

    @ApiProperty({
        type: () => BasicTontineDto,
    })
    tontine: BasicTontineDto;

    @ApiProperty({
        enum: MembershipRole,
    })
    role: MembershipRole;

    @ApiProperty({
        enum: MembershipStatus,
    })
    status: MembershipStatus;

    @ApiProperty()
    joinedAt: Date;

    @ApiProperty({
        nullable: true,
    })
    leftAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}