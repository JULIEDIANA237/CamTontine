import { ApiProperty } from '@nestjs/swagger';

import {
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

export class BasicMembershipDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    tontineId: string;

    @ApiProperty({
        enum: MembershipRole,
    })
    role: MembershipRole;

    @ApiProperty({
        enum: MembershipStatus,
    })
    status: MembershipStatus;
}