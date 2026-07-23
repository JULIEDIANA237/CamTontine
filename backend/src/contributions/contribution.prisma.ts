import { Prisma } from '@prisma/client';

export const contributionDetailsInclude =
    Prisma.validator<Prisma.ContributionInclude>()({
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
                status: true,
            },
        },

        payment: true,

        penalty: true,
    });

export type ContributionWithRelations =
    Prisma.ContributionGetPayload<{
        include: typeof contributionDetailsInclude;
    }>;
