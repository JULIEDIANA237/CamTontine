import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { UserRole } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        // Si aucun rôle n'est requis
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const user = request.user;

        if (!user) {
            throw new ForbiddenException(
                'Utilisateur non authentifié.',
            );
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException(
                "Vous n'avez pas les permissions nécessaires.",
            );
        }

        return true;
    }
}