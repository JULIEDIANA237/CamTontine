import { ApiProperty } from '@nestjs/swagger';

import { FieldErrorDto } from './field-error.dto';

export class ValidationErrorDto {
    @ApiProperty({
        example: false,
    })
    success: false;

    @ApiProperty({
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        example: 'Erreur de validation.',
    })
    message: string;

    @ApiProperty({
        type: [FieldErrorDto],
    })
    errors: FieldErrorDto[];
}