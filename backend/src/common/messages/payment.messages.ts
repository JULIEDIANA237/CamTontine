export const PaymentMessages = {
    CREATED: 'Paiement initié avec succès.',

    PROCESSED: 'Paiement traité avec succès.',

    REFUNDED: 'Paiement remboursé avec succès.',

    FOUND: 'Paiement récupéré avec succès.',

    LIST: 'Liste des paiements récupérée avec succès.',

    NOT_FOUND: 'Paiement introuvable.',

    ALREADY_EXISTS:
        'Un paiement existe déjà pour cette contribution.',

    INVALID_STATUS:
        'Le statut du paiement ne permet pas cette opération.',

    CONTRIBUTION_NOT_FOUND:
        'Contribution introuvable.',

    CONTRIBUTION_ALREADY_PAID:
        'Cette contribution a déjà été payée.',

    AMOUNT_MISMATCH:
        'Le montant du paiement doit correspondre au montant de la contribution.',
} as const;
