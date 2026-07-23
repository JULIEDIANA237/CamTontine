import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponseDto {
    @ApiProperty({
        example: '2c79d51c-14dd-4d4d-b65d-b8e7c3f51c54',
    })
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}