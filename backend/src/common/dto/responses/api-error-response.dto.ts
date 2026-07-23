import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
    @ApiProperty({
        example: false,
    })
    success: false;

    @ApiProperty({
        example: 404,
    })
    statusCode: number;

    @ApiProperty({
        example: 'Cycle introuvable.',
    })
    message: string;

    @ApiProperty()
    timestamp: string;

    @ApiProperty()
    path: string;
}