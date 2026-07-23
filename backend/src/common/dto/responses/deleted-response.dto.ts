import { ApiProperty } from '@nestjs/swagger';

export class DeletedResponseDto {
    @ApiProperty({
        example: true,
    })
    success: true;

    @ApiProperty({
        example: 'Suppression effectuée avec succès.',
    })
    message: string;
}