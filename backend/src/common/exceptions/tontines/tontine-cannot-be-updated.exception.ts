import { BadRequestException } from '@nestjs/common';

export class TontineCannotBeUpdatedException extends BadRequestException {
    constructor() {
        super(
            'Cette tontine ne peut plus être modifiée.',
        );
    }
}