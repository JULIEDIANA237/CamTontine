import { Injectable } from '@nestjs/common';

import { User } from '@prisma/client';

import { BaseMapper } from '../../common/mappers';

import { UserResponseDto } from '../dto/responses/user-response.dto';
import { UserListItemDto } from '../dto/responses/user-list-item.dto';


@Injectable()
export class UserMapper extends BaseMapper<
    User,
    UserResponseDto
> {

    /**
     * Transformation complète utilisateur
     */
    override toResponse(
        user: User,
    ): UserResponseDto {

        return {
            id: user.id,

            firstName: user.firstName,

            lastName: user.lastName,

            email: user.email,

            phone: user.phone,

            avatarUrl: user.avatarUrl,

            locale: user.locale,

            role: user.role,

            status: user.status,

            emailVerified: user.emailVerified,

            lastLoginAt: user.lastLoginAt,

            createdAt: user.createdAt,

            updatedAt: user.updatedAt,
        };
    }


    /**
     * Transformation légère pour les listes
     */
    toListItem(
        user: User,
    ): UserListItemDto {

        return {
            id: user.id,

            firstName: user.firstName,

            lastName: user.lastName,

            email: user.email,

            phone: user.phone,

            role: user.role,

            status: user.status,

            createdAt: user.createdAt,
        };
    }


    /**
     * Transformation d'une liste utilisateur
     */
    toList(
        users: User[],
    ): UserListItemDto[] {

        return users.map(
            (user) =>
                this.toListItem(user),
        );
    }
}