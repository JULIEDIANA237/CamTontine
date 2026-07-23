import { ApiProperty } from '@nestjs/swagger';

export class MonthlyStatisticsResponseDto {
    @ApiProperty({
        example: 2026,
    })
    year: number;

    @ApiProperty({
        example: 7,
    })
    month: number;

    @ApiProperty({
        example: 250,
    })
    contributions: number;

    @ApiProperty({
        example: 230,
    })
    payments: number;

    @ApiProperty({
        example: 8,
    })
    penalties: number;

    @ApiProperty({
        example: 6,
    })
    payouts: number;

    @ApiProperty({
        example: 3500000,
    })
    collectedAmount: number;

    @ApiProperty({
        example: 3200000,
    })
    paidAmount: number;
}