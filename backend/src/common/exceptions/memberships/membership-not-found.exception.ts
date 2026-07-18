import { NotFoundException } from '@nestjs/common';

export class MembershipNotFoundException extends NotFoundException {
    constructor() {
        super('Membre introuvable.');
    }
}