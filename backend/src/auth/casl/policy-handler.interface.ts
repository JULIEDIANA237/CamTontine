import { AppAbility } from './app-ability.type';

export interface PolicyHandler {
    handle(ability: AppAbility): boolean;
}

export type PolicyHandlerCallback = (
    ability: AppAbility,
) => boolean;

export type PolicyHandlerType =
    | PolicyHandler
    | PolicyHandlerCallback;