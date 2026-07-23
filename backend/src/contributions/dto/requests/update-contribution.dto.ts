import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateContributionDto } from './create-contribution.dto';

export class UpdateContributionDto extends PartialType(CreateContributionDto) {
    @ApiPropertyOptional({
        description: 'Note ou commentaire',
    })
    @IsOptional()
    @IsString()
    note?: string;
}
