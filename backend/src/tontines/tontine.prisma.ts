import { Prisma } from '@prisma/client';

export const tontineDetailsInclude =
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

export type TontineWithRelations =
    Prisma.TontineGetPayload<{
        include: typeof tontineDetailsInclude;
    }>;