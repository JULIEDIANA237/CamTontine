import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserIdParamDto {
    @ApiProperty({
        example: '6d89f61b-8b0f-43b0-9df9-1d531e5d41f5',
    })
    @IsUUID()
    id: string;
}