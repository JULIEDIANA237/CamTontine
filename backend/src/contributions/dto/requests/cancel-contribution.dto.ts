import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelContributionDto {
    @ApiPropertyOptional({
        description: "Motif de l'annulation",
    })
    @IsOptional()
    @IsString()
    reason?: string;
}
