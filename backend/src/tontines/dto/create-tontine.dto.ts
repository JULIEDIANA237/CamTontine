import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    Min,
    IsDateString,
    IsEnum,
    IsInt,
} from 'class-validator';

import {
    Frequency,
} from '@prisma/client';
import { IsAfterDate, IsGreaterThan } from '../validators';

export class CreateTontineDto {
    @ApiProperty({
        example: 'Tontine Famille',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'Tontine familiale 2026',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 5000,
        description: 'Montant de la cotisation',
    })
    @IsNumber()
    @Min(1)
    contributionAmount: number;

    @ApiProperty({
        enum: Frequency,
        example: Frequency.MONTHLY,
    })
    @IsEnum(Frequency)
    frequency: Frequency;

    @ApiProperty({
        example: 5,
    })
    @IsInt()
    @Min(2)
    minimumMembers: number;

    @ApiProperty({
        example: 20,
    })
    @IsInt()
    @Min(2)
    @IsGreaterThan('minimumMembers', {
        message:
            'maximumMembers doit être supérieur ou égal à minimumMembers.',
    })
    maximumMembers: number;

    @ApiPropertyOptional({
        example: '2026-08-01',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({
        example: '2027-08-01',
    })
    @IsOptional()
    @IsDateString()
    @IsAfterDate('startDate', {
        message:
            'endDate doit être postérieure à startDate.',
    })
    endDate?: string;
}