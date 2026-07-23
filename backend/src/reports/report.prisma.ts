import { Prisma } from '@prisma/client';

export const reportDetailsInclude =
    Prisma.validator<Prisma.ReportInclude>()({
        tontine: {
            select: {
                id: true,
                name: true,
            },
        },
        file: {
            select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                path: true,
                size: true,
            },
        },
        createdBy: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        },
    });

export type ReportWithRelations =
    Prisma.ReportGetPayload<{
        include: typeof reportDetailsInclude;
    }>;
