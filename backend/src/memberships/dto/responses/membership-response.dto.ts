import { ApiProperty } from '@nestjs/swagger';

import {
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

export class MembershipUserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;
}

export class MembershipTontineResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}

export class MembershipResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        type: MembershipUserResponseDto,
    })
    user: MembershipUserResponseDto;

    @ApiProperty({
        type: MembershipTontineResponseDto,
    })
    tontine: MembershipTontineResponseDto;

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