import { TontineStatus, Frequency } from '@prisma/client';

export interface TontineResponse {
    id: string;
    name: string;
    description: string | null;

    contributionAmount: number;

    frequency: Frequency;

    minimumMembers: number;
    maximumMembers: number;

    startDate: Date | null;
    endDate: Date | null;

    status: TontineStatus;

    createdAt: Date;
    updatedAt: Date;

    creator: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };

    memberCount: number;
}

export class TontineMapper {
    static toResponse(tontine: any): TontineResponse {
        return {
            id: tontine.id,

            name: tontine.name,

            description: tontine.description,

            contributionAmount: Number(
                tontine.contributionAmount,
            ),

            frequency: tontine.frequency,

            minimumMembers: tontine.minimumMembers,

            maximumMembers: tontine.maximumMembers,

            startDate: tontine.startDate,

            endDate: tontine.endDate,

            status: tontine.status,

            createdAt: tontine.createdAt,

            updatedAt: tontine.updatedAt,

            creator: {
                id: tontine.creator.id,

                firstName: tontine.creator.firstName,

                lastName: tontine.creator.lastName,

                email: tontine.creator.email,
            },

            memberCount:
                tontine._count.memberships,
        };
    }
}