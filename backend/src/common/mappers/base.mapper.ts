export abstract class BaseMapper<
    Entity,
    ResponseDto,
    ListItemDto = ResponseDto,
> {
    /**
     * Convertit une entité vers son DTO détaillé.
     */
    abstract toResponse(
        entity: Entity,
    ): ResponseDto;

    /**
     * Convertit une entité vers son DTO de liste.
     * Par défaut, on utilise le DTO complet.
     */
    toListItem(
        entity: Entity,
    ): ListItemDto {
        return this.toResponse(
            entity,
        ) as unknown as ListItemDto;
    }

    /**
     * Convertit une liste vers les DTO détaillés.
     */
    toResponseList(
        entities: Entity[],
    ): ResponseDto[] {
        return entities.map((entity) =>
            this.toResponse(entity),
        );
    }

    /**
     * Alias plus court.
     */
    toList(
        entities: Entity[],
    ): ListItemDto[] {
        return entities.map((entity) =>
            this.toListItem(entity),
        );
    }

    /**
     * Convertit une entité nullable.
     */
    toNullableResponse(
        entity: Entity | null,
    ): ResponseDto | null {
        if (!entity) {
            return null;
        }

        return this.toResponse(entity);
    }

    /**
     * Convertit une liste paginée.
     */
    toPaginatedResponse(
        entities: Entity[],
        meta: {
            page: number;
            limit: number;
            total: number;
        },
    ) {
        return {
            data: this.toList(entities),

            meta: {
                page: meta.page,

                limit: meta.limit,

                total: meta.total,

                totalPages: Math.ceil(
                    meta.total / meta.limit,
                ),
            },
        };
    }
}