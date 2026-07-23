import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
    @ApiProperty({
        example: true,
    })
    success: true;

    @ApiProperty()
    message: string;

    data: T;
}