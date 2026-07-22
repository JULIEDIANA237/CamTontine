import { Frequency, TontineStatus } from "@prisma/client";

export class TontineListItemDto {

    id: string;

    name: string;

    contributionAmount: number;

    frequency: Frequency;

    status: TontineStatus;

    memberCount: number;

    createdAt: Date;
}