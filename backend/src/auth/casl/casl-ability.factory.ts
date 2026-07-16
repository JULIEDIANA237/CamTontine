import {
    AbilityBuilder,
} from '@casl/ability';

import {
    Injectable,
} from '@nestjs/common';

import {
    MembershipRole,
    UserRole,
} from '@prisma/client';

import {
    AuthorizationContext,
} from '../../authorization/interfaces/authorization-context.interface';

import { Action } from './actions.enum';

import {
    AppAbility,
    createAppAbility,
} from './app-ability.type';

@Injectable()
export class CaslAbilityFactory {
    createForContext(
        context: AuthorizationContext,
    ): AppAbility {
        const { can, build } =
            new AbilityBuilder<AppAbility>(
                createAppAbility,
            );

        /**
         * ===========================================
         * SUPER ADMIN
         * ===========================================
         */

        if (
            context.user.role ===
            UserRole.SUPER_ADMIN
        ) {
            can(Action.Manage, 'all');

            return build();
        }

        /**
         * ===========================================
         * Tous les utilisateurs connectés
         * ===========================================
         */

        can(Action.Read, 'User');

        can(Action.Update, 'User');

        can(Action.Read, 'Notification');

        /**
         * ===========================================
         * Permissions liées à la tontine
         * ===========================================
         */

        switch (context.membershipRole) {
            case MembershipRole.MANAGER:

                can(Action.Manage, 'Membership');

                can(Action.Update, 'Tontine');

                can(Action.Read, 'Report');

                can(Action.Create, 'Invitation');

                break;

            case MembershipRole.TREASURER:

                can(Action.Read, 'Membership');

                can(Action.Manage, 'Contribution');

                can(Action.Read, 'Report');

                break;

            case MembershipRole.SECRETARY:

                can(Action.Read, 'Membership');

                can(Action.Create, 'Invitation');

                can(Action.Read, 'Report');

                break;

            case MembershipRole.MEMBER:

                can(Action.Read, 'Membership');

                can(Action.Read, 'Contribution');

                break;

            default:
                break;
        }

        return build();
    }
}