import { Prisma } from '@prisma/client';

export const TONTINE_INCLUDE =
    Prisma.validator<Prisma.TontineInclude>()({
        creator: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        },
        _count: {
            select: {
                memberships: true,
            },
        },
    });