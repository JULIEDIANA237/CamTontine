import { ConflictException } from '@nestjs/common';

export class EmailAlreadyUsedException extends ConflictException {
    constructor() {
        super('Cet email est déjà utilisé.');
    }
}