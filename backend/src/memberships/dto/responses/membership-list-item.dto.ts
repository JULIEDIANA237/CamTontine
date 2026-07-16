import { ApiProperty } from '@nestjs/swagger';

import {
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

export class MembershipListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

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
}