import {
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

import {
    Membership,
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

@Injectable()
export class MembershipPolicyService {
    ensureCanUpdateRole(
        currentMembership: Membership,
        targetMembership: Membership,
    ) {
        if (
            currentMembership.id ===
            targetMembership.id
        ) {
            throw new ForbiddenException(
                'Vous ne pouvez pas modifier votre propre rôle.',
            );
        }
    }

    ensureCanRemove(
        currentMembership: Membership,
        targetMembership: Membership,
    ) {
        if (
            currentMembership.id ===
            targetMembership.id
        ) {
            throw new ForbiddenException(
                'Vous ne pouvez pas vous retirer vous-même.',
            );
        }

        if (
            targetMembership.status ===
            MembershipStatus.REMOVED
        ) {
            throw new ForbiddenException(
                'Ce membre est déjà retiré.',
            );
        }
    }

    ensureCanInvite(
        membership: Membership,
    ) {
        if (
            membership.status !==
            MembershipStatus.ACTIVE
        ) {
            throw new ForbiddenException(
                'Votre adhésion est inactive.',
            );
        }
    }

    ensureManager(
        membership: Membership,
    ) {
        if (
            membership.role !==
            MembershipRole.MANAGER
        ) {
            throw new ForbiddenException(
                'Action réservée au manager.',
            );
        }
    }
}