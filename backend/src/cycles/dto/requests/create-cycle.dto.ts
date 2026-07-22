import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateCycleDto {
    @IsInt()
    @Min(1)
    number: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    dueDate: string;
}