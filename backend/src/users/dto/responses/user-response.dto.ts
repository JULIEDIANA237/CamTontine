import { ApiProperty } from '@nestjs/swagger';
import {
    Locale,
    UserRole,
    UserStatus,
} from '@prisma/client';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty({
        nullable: true,
    })
    avatarUrl: string | null;

    @ApiProperty({
        enum: Locale,
    })
    locale: Locale;

    @ApiProperty({
        enum: UserRole,
    })
    role: UserRole;

    @ApiProperty({
        enum: UserStatus,
    })
    status: UserStatus;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty({
        nullable: true,
    })
    lastLoginAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}