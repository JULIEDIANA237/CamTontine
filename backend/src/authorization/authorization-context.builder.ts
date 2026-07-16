import { Injectable } from '@nestjs/common';

import {
    MembershipStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
    AuthorizationContext,
} from './interfaces/authorization-context.interface';

@Injectable()
export class AuthorizationContextBuilder {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async build(
        userId: string,
        tontineId?: string,
    ): Promise<AuthorizationContext> {
        const user =
            await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
            });

        /**
         * Routes qui ne concernent pas une tontine
         */

        if (!tontineId) {
            return {
                user,
                tontine: null,
                membership: null,
                membershipRole: null,
            };
        }

        /**
         * Routes concernant une tontine
         */

        const [tontine, membership] =
            await Promise.all([
                this.prisma.tontine.findUnique({
                    where: {
                        id: tontineId,
                    },
                }),

                this.prisma.membership.findFirst({
                    where: {
                        userId,
                        tontineId,
                        status: MembershipStatus.ACTIVE,
                    },
                }),
            ]);

        return {
            user,
            tontine,
            membership,
            membershipRole:
                membership?.role ?? null,
        };
    }
}