import {
    MongoAbility,
    createMongoAbility,
} from '@casl/ability';

import { Action } from './actions.enum';
import { Subjects } from './subjects';

export type AppAbility = MongoAbility<
    [Action, Subjects]
>;

/**
 * Factory utilisée par AbilityBuilder.
 * Toute l'application utilisera cette seule définition.
 */
export const createAppAbility = (
    rules = [],
) => createMongoAbility<
    [Action, Subjects]
>(rules);