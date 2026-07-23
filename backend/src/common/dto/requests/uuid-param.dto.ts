import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class UuidParamDto {
    @ApiProperty({
        description: 'Identifiant UUID',
        example: 'e8ef7c13-3af5-4dc0-93fd-4c6a1d85db50',
    })
    @IsUUID()
    id: string;
}