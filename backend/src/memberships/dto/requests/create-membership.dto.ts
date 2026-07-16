import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateMembershipDto {
    @ApiProperty({
        description: 'Identifiant de l’utilisateur',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        enum: MembershipRole,
        default: MembershipRole.MEMBER,
    })
    @IsEnum(MembershipRole)
    role: MembershipRole;
}