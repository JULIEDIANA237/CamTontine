import { Action } from '../../auth/casl/actions.enum';

import { AppAbility } from '../../auth/casl/app-ability.type';

export class MembershipPolicies {
    static create() {
        return (
            ability: AppAbility,
        ) =>
            ability.can(
                Action.Create,
                'Membership',
            );
    }

    static read() {
        return (
            ability: AppAbility,
        ) =>
            ability.can(
                Action.Read,
                'Membership',
            );
    }

    static update() {
        return (
            ability: AppAbility,
        ) =>
            ability.can(
                Action.Update,
                'Membership',
            );
    }

    static delete() {
        return (
            ability: AppAbility,
        ) =>
            ability.can(
                Action.Delete,
                'Membership',
            );
    }
}