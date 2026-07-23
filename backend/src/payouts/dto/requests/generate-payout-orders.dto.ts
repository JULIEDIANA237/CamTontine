import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class GeneratePayoutOrdersDto {
    @ApiPropertyOptional({
        description: 'Randomiser l’ordre de passage des membres (tirage au sort)',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    randomize?: boolean = true;
}
