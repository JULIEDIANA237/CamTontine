import { Prisma } from '@prisma/client';

export const invitationDetailsInclude =
    Prisma.validator<Prisma.InvitationInclude>()({
        tontine: {
            select: {
                id: true,
                name: true,
                description: true,
                contributionAmount: true,
                frequency: true,
            },
        },
        invitedBy: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        },
    });

export type InvitationWithRelations =
    Prisma.InvitationGetPayload<{
        include: typeof invitationDetailsInclude;
    }>;
