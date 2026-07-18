import { BadRequestException } from '@nestjs/common';

export class MembershipLimitReachedException extends BadRequestException {
    constructor() {
        super(
            'La tontine a atteint son nombre maximal de membres.',
        );
    }
}