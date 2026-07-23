import { Prisma } from '@prisma/client';

export const penaltyDetailsInclude =
    Prisma.validator<Prisma.PenaltyInclude>()({
        contribution: {
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
                        tontine: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                cycle: {
                    select: {
                        id: true,
                        number: true,
                        name: true,
                    },
                },
            },
        },
    });

export type PenaltyWithRelations =
    Prisma.PenaltyGetPayload<{
        include: typeof penaltyDetailsInclude;
    }>;
