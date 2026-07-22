import {
    IsDateString,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateCycleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
}