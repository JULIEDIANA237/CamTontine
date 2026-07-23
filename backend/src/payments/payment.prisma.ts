import { Prisma } from '@prisma/client';

export const paymentDetailsInclude =
    Prisma.validator<Prisma.PaymentInclude>()({
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

export type PaymentWithRelations =
    Prisma.PaymentGetPayload<{
        include: typeof paymentDetailsInclude;
    }>;
