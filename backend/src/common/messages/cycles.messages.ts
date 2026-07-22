export const CycleMessages = {
    CREATED: 'Cycle créé avec succès.',

    UPDATED: 'Cycle mis à jour avec succès.',

    OPENED: 'Cycle ouvert avec succès.',

    CLOSED: 'Cycle clôturé avec succès.',

    CANCELLED: 'Cycle annulé avec succès.',

    FOUND: 'Cycle récupéré avec succès.',

    LIST: 'Liste des cycles récupérée avec succès.',

    CURRENT: 'Cycle courant récupéré avec succès.',

    NOT_FOUND: 'Cycle introuvable.',

    ALREADY_EXISTS: 'Ce numéro de cycle existe déjà.',

    ALREADY_OPEN: 'Un cycle est déjà ouvert.',

    INVALID_DATES:
        'La date de fin doit être postérieure à la date de début.',

    TONTINE_NOT_ACTIVE:
        'Les cycles ne peuvent être créés que pour une tontine active.',

    MINIMUM_MEMBERS:
        "Le nombre minimum de membres n'est pas atteint.",

    CANNOT_CANCEL:
        'Ce cycle ne peut plus être annulé.',

    CANNOT_UPDATE:
        'Ce cycle ne peut plus être modifié.',

    CONTRIBUTIONS_PENDING:
        'Toutes les contributions doivent être validées avant la clôture.',
} as const;