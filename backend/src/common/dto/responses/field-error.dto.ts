import { ApiProperty } from '@nestjs/swagger';

export class FieldErrorDto {
    @ApiProperty({
        example: 'email',
    })
    field: string;

    @ApiProperty({
        example: 'Adresse email invalide.',
    })
    message: string;
}