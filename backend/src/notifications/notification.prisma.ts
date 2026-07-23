import { Prisma } from '@prisma/client';

export const notificationDetailsInclude =
    Prisma.validator<Prisma.NotificationInclude>()({
        user: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        },
    });

export type NotificationWithRelations =
    Prisma.NotificationGetPayload<{
        include: typeof notificationDetailsInclude;
    }>;
