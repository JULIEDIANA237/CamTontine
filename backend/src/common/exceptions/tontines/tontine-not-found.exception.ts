import { NotFoundException } from '@nestjs/common';

export class TontineNotFoundException extends NotFoundException {
    constructor() {
        super('Tontine introuvable.');
    }
}