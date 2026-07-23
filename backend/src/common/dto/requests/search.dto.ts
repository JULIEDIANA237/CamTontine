import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

import { BaseRequestDto } from './base-request.dto';

export class SearchDto extends BaseRequestDto {
    @ApiPropertyOptional({
        example: 'Jean',
        description: 'Recherche globale',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;
}