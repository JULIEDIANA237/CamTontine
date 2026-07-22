import {
    IsOptional,
    IsString,
} from 'class-validator';

export class CancelCycleDto {
    @IsOptional()
    @IsString()
    reason?: string;
}