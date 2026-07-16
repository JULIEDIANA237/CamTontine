import {
    Frequency,
    TontineStatus,
} from '@prisma/client';

import {
    ApiProperty,
} from '@nestjs/swagger';

export class CreatorResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;
}

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
        type: CreatorResponseDto,
    })
    creator: CreatorResponseDto;

    @ApiProperty()
    memberCount: number;
}