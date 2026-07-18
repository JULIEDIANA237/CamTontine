import { ConflictException } from '@nestjs/common';

export class MembershipAlreadyExistsException extends ConflictException {
    constructor() {
        super(
            'Cet utilisateur est déjà membre de cette tontine.',
        );
    }
}