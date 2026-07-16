export class ApiResponse {

    static success<T>(
        data: T,
        message?: string,
    ) {
        return {
            success: true,

            message,

            data,
        };
    }



    static created<T>(
        data: T,
        message = 'Ressource créée avec succès.',
    ) {
        return {
            success: true,

            message,

            data,
        };
    }



    static updated<T>(
        data: T,
        message = 'Ressource mise à jour avec succès.',
    ) {
        return {
            success: true,

            message,

            data,
        };
    }



    static deleted<T>(
        data?: T,
        message = 'Ressource supprimée avec succès.',
    ) {
        return {
            success: true,

            message,

            data,
        };
    }



    static paginated<T>(
        data: T[],
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        },
    ) {

        return {
            success: true,

            data,

            meta,
        };
    }
}