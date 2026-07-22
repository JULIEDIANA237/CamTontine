import { ApiProperty } from '@nestjs/swagger';

export class BasicTontineDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}