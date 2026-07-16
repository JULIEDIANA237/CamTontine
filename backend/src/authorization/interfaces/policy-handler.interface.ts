import { AppAbility } from '../../auth/casl/app-ability.type';

export interface PolicyHandler {
    handle(
        ability: AppAbility,
    ): boolean;
}

export type PolicyHandlerCallback = (
    ability: AppAbility,
) => boolean;