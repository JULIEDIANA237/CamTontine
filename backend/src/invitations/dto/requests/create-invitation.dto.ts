import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateInvitationDto {
    @ApiPropertyOptional({ description: 'E-mail de l’invité', example: 'invitation@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'Numéro de téléphone de l’invité', example: '+237690000000' })
    @IsOptional()
    @IsString()
    phone?: string;
}
