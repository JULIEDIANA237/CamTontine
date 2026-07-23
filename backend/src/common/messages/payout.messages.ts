export const PayoutMessages = {
    CREATED: 'Distribution (payout) créée avec succès.',

    PROCESSED: 'Distribution effectuée/marquée comme payée avec succès.',

    CANCELLED: 'Distribution annulée avec succès.',

    FOUND: 'Distribution récupérée avec succès.',

    LIST: 'Liste des distributions récupérée avec succès.',

    NOT_FOUND: 'Distribution introuvable.',

    ALREADY_EXISTS:
        'Une distribution existe déjà pour ce cycle.',

    CYCLE_NOT_FOUND:
        'Cycle introuvable.',

    BENEFICIARY_NOT_FOUND:
        'Bénéficiaire introuvable.',

    INVALID_STATUS:
        'Le statut de la distribution ne permet pas cette opération.',

    ORDERS_GENERATED:
        'Ordre des tirages/passages généré avec succès.',

    ORDERS_SWAPPED:
        'Tours de passage échangés avec succès.',

    ORDER_NOT_FOUND:
        'Ordre de passage introuvable.',
} as const;
