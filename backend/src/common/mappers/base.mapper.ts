export abstract class BaseMapper<
    Entity,
    ResponseDto,
> {
    /**
     * Convertit une entité vers son DTO de réponse.
     */
    abstract toResponse(
        entity: Entity,
    ): ResponseDto;

    /**
     * Convertit une liste d'entités.
     */
    toResponseList(
        entities: Entity[],
    ): ResponseDto[] {
        return entities.map((entity) =>
            this.toResponse(entity),
        );
    }

    /**
     * Retourne null si l'entité est null.
     */
    toNullableResponse(
        entity: Entity | null,
    ): ResponseDto | null {
        if (!entity) {
            return null;
        }

        return this.toResponse(entity);
    }
}