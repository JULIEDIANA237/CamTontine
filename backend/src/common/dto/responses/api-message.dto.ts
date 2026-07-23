import { ApiProperty } from '@nestjs/swagger';

export class ApiMessageDto {
    @ApiProperty({
        example: 'Opération effectuée avec succès.',
    })
    message: string;
}