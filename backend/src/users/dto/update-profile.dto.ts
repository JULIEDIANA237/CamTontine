import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional({
        example: 'John',
    })
    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @ApiPropertyOptional({
        example: 'Doe',
    })
    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;

    @ApiPropertyOptional({
        example: '+237670123456',
    })
    @IsOptional()
    @IsString()
    phone?: string;
}