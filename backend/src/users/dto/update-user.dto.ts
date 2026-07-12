import { PartialType } from '@nestjs/swagger';

import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
} from 'class-validator';

import {
    Locale,
    UserRole,
    UserStatus,
} from '@prisma/client';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(class { }) {
    @ApiPropertyOptional({
        example: 'Julie',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({
        example: 'Diana',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @ApiPropertyOptional({
        example: 'john@gmail.com',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        example: '+237670123456',
    })
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiPropertyOptional({
        enum: Locale,
    })
    @IsOptional()
    @IsEnum(Locale)
    locale?: Locale;


}