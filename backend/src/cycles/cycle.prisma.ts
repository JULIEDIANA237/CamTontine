import { Prisma } from '@prisma/client';

export const cycleDetailsInclude =
    Prisma.validator<Prisma.CycleInclude>()({
        tontine: {
            select: {
                id: true,
                name: true,
            },
        },

        contributions: {
            include: {
                membership: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },

                payment: true,

                penalty: true,
            },
        },

        payout: true,

        _count: {
            select: {
                contributions: true,
            },
        },
    });

export type CycleWithRelations =
    Prisma.CycleGetPayload<{
        include: typeof cycleDetailsInclude;
    }>;