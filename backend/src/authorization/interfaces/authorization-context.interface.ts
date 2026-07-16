import {
    Membership,
    MembershipRole,
    Tontine,
    User,
} from '@prisma/client';

export interface AuthorizationContext {

    user: User;

    tontine?: Tontine | null;

    membership?: Membership | null;

    membershipRole?: MembershipRole | null;
}