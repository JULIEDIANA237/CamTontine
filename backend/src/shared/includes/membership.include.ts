import { Prisma } from '@prisma/client';

export const MEMBERSHIP_INCLUDE =
    Prisma.validator<Prisma.MembershipInclude>()({
        user: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        },
        tontine: {
            select: {
                id: true,
                name: true,
            },
        },
    });