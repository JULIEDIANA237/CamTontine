import { ForbiddenException } from '@nestjs/common';

export class CannotDeleteYourselfException extends ForbiddenException {
    constructor() {
        super(
            'Vous ne pouvez pas supprimer votre propre compte.',
        );
    }
}