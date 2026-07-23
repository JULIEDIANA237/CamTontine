import { ApiProperty } from '@nestjs/swagger';

export class AdminStatisticsResponseDto {
    @ApiProperty({
        example: 120,
        description: "Nombre total d'utilisateurs",
    })
    users: number;

    @ApiProperty({
        example: 110,
        description: 'Nombre de comptes actifs',
    })
    activeUsers: number;

    @ApiProperty({
        example: 10,
        description: 'Nombre de comptes suspendus',
    })
    suspendedUsers: number;

    @ApiProperty({
        example: 35,
        description: 'Nombre total de tontines',
    })
    tontines: number;

    @ApiProperty({
        example: 18,
        description: 'Nombre de tontines actives',
    })
    activeTontines: number;

    @ApiProperty({
        example: 5,
        description: 'Nombre de tontines terminées',
    })
    completedTontines: number;

    @ApiProperty({
        example: 450,
        description: 'Nombre total des adhésions',
    })
    memberships: number;

    @ApiProperty({
        example: 420,
        description: 'Nombre de membres actifs',
    })
    activeMemberships: number;

    @ApiProperty({
        example: 52,
        description: 'Nombre total de cycles',
    })
    cycles: number;

    @ApiProperty({
        example: 3500,
        description: 'Nombre total des cotisations',
    })
    contributions: number;

    @ApiProperty({
        example: 3300,
        description: 'Cotisations validées',
    })
    validatedContributions: number;

    @ApiProperty({
        example: 3500,
        description: 'Nombre total des paiements',
    })
    payments: number;

    @ApiProperty({
        example: 3400,
        description: 'Paiements réussis',
    })
    successfulPayments: number;

    @ApiProperty({
        example: 52,
        description: 'Nombre total des distributions',
    })
    payouts: number;

    @ApiProperty({
        example: 50,
        description: 'Distributions effectuées',
    })
    paidPayouts: number;

    @ApiProperty({
        example: 18,
        description: 'Nombre total des pénalités',
    })
    penalties: number;

    @ApiProperty({
        example: 125000000,
        description: 'Montant total collecté',
    })
    totalCollected: number;

    @ApiProperty({
        example: 119000000,
        description: 'Montant total distribué',
    })
    totalPaid: number;

    @ApiProperty({
        example: 250000,
        description: 'Montant total des pénalités',
    })
    totalPenalties: number;
}