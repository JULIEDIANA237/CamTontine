import { ApiProperty } from '@nestjs/swagger';
import {
    UserRole,
    UserStatus,
} from '@prisma/client';

export class UserListItemDto {
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
        enum: UserRole,
    })
    role: UserRole;

    @ApiProperty({
        enum: UserStatus,
    })
    status: UserStatus;

    @ApiProperty()
    createdAt: Date;
}