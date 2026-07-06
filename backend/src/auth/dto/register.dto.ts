import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

enum Locale {
    FR = 'FR',
    EN = 'EN',
}

export class RegisterDto {
    @ApiProperty({
        example: 'john.doe@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '+237670123456',
    })
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({
        example: 'John',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        example: 'Doe',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;

    @ApiProperty({
        example: 'Password@123',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({
        enum: Locale,
        required: false,
        default: Locale.FR,
    })
    @IsOptional()
    @IsEnum(Locale)
    locale?: Locale;
}