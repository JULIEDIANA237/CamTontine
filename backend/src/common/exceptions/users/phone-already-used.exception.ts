import { ConflictException } from '@nestjs/common';

export class PhoneAlreadyUsedException extends ConflictException {
    constructor() {
        super(
            'Ce numéro de téléphone est déjà utilisé.',
        );
    }
}