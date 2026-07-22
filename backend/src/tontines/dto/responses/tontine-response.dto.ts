import { ApiProperty } from '@nestjs/swagger';

import {
    Frequency,
    TontineStatus,
} from '@prisma/client';

import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class TontineResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({
        nullable: true,
    })
    description: string | null;

    @ApiProperty()
    contributionAmount: number;

    @ApiProperty({
        enum: Frequency,
    })
    frequency: Frequency;

    @ApiProperty()
    minimumMembers: number;

    @ApiProperty()
    maximumMembers: number;

    @ApiProperty({
        nullable: true,
    })
    startDate: Date | null;

    @ApiProperty({
        nullable: true,
    })
    endDate: Date | null;

    @ApiProperty({
        enum: TontineStatus,
    })
    status: TontineStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({
        type: () => BasicUserDto,
    })
    creator: BasicUserDto;

    @ApiProperty()
    memberCount: number;
}