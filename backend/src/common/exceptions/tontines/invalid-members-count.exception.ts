import { BadRequestException } from '@nestjs/common';

export class InvalidMembersCountException extends BadRequestException {
    constructor() {
        super(
            'Le nombre maximum de membres doit être supérieur ou égal au minimum.',
        );
    }
}