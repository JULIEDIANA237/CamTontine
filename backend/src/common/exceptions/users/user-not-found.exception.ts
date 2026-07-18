import { ErrorCode } from '../../errors/error-codes';

import { AppNotFoundException } from '../base/not-found.exception';

export class UserNotFoundException
    extends AppNotFoundException {

    constructor() {
        super(
            ErrorCode.USER_NOT_FOUND,
            'Utilisateur introuvable.',
        );
    }
}