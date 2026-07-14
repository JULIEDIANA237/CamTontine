import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { TontineStatus } from '@prisma/client';

export class UpdateTontineStatusDto {
    @ApiProperty({
        enum: TontineStatus,
    })
    @IsEnum(TontineStatus)
    status: TontineStatus;
}