import { ApiProperty } from '@nestjs/swagger';
import { MembershipStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateMembershipStatusDto {
    @ApiProperty({
        enum: MembershipStatus,
    })
    @IsEnum(MembershipStatus)
    status: MembershipStatus;
}