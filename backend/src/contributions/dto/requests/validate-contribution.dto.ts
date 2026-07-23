import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ValidateContributionDto {
    @ApiPropertyOptional({
        description: 'Note de validation optionnelle',
    })
    @IsOptional()
    @IsString()
    note?: string;
}
