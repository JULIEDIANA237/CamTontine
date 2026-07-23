import { ApiHideProperty } from '@nestjs/swagger';

export abstract class BaseRequestDto {
    @ApiHideProperty()
    readonly __brand?: never;
}