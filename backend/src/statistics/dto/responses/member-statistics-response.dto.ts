import { ApiProperty } from '@nestjs/swagger';

export class MemberStatisticsResponseDto {
    @ApiProperty()
    totalContributions: number;

    @ApiProperty()
    validatedContributions: number;

    @ApiProperty()
    pendingContributions: number;

    @ApiProperty()
    totalPaid: number;

    @ApiProperty()
    penalties: number;

    @ApiProperty()
    payoutsReceived: number;

    @ApiProperty({
        nullable: true,
        description: 'Prochain ordre de passage',
    })
    nextTurn: number | null;
}