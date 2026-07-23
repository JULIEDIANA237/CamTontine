import { Prisma } from '@prisma/client';

export const payoutDetailsInclude =
    Prisma.validator<Prisma.PayoutInclude>()({
        cycle: {
            select: {
                id: true,
                number: true,
                name: true,
                tontineId: true,
                expectedAmount: true,
                collectedAmount: true,
            },
        },
        beneficiary: {
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
    });

export type PayoutWithRelations =
    Prisma.PayoutGetPayload<{
        include: typeof payoutDetailsInclude;
    }>;

export const payoutOrderDetailsInclude =
    Prisma.validator<Prisma.PayoutOrderInclude>()({
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
        exchangedWithOrder: {
            include: {
                membership: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        },
    });

export type PayoutOrderWithRelations =
    Prisma.PayoutOrderGetPayload<{
        include: typeof payoutOrderDetailsInclude;
    }>;
