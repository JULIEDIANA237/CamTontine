import {
    Injectable,
} from '@nestjs/common';

import {
    AbilityBuilder,
    createMongoAbility,
} from '@casl/ability';

import {
    User,
} from '@prisma/client';

import {
    Action,
} from './actions.enum';

import {
    AppAbility,
} from './app-ability.type';



@Injectable()
export class CaslAbilityFactory {


    createForUser(
        user: User,
    ): AppAbility {


        const {
            can,
            build,
        } =
            new AbilityBuilder<AppAbility>(
                createMongoAbility,
            );


        /**
         * SUPER ADMIN
         */

        if (
            user.role === 'SUPER_ADMIN'
        ) {

            can(
                Action.Manage,
                'all',
            );


            return build();
        }



        /**
         * USER
         */


        can(
            Action.Read,
            'User',
        );


        can(
            Action.Update,
            'User'
        );


        can(
            Action.Read,
            'Notification',
        );


        can(
            Action.Read,
            'Report',
        );


        return build();

    }

}