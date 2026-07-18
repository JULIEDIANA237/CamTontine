import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserMapper } from './mappers/user.mapper';
import { ApiResponse } from '../common/responses';
import { UsersLoader } from '../shared/loaders/users.loader';
import { UserMessages } from '../common/messages';


@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly usersLoader: UsersLoader,
  ) { }

  // Common fields to select for user queries
  private userSelect(): Prisma.UserSelect {
    return {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      locale: true,
      role: true,
      status: true,
      emailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,
    };
  }



  // Build a where clause for findAll, consolidating search, role, and status filters
  private buildWhere(query: QueryUsersDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = this.baseUserWhere();

    if (query.search?.trim()) {
      where.OR = [
        { firstName: { contains: query.search } },
        { lastName: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }

    if (query.role !== undefined) {
      where.role = query.role;
    }

    if (query.status !== undefined) {
      where.status = query.status;
    }

    return where;
  }

  // Base where clause to exclude deleted users
  private baseUserWhere(): Prisma.UserWhereInput {
    return { status: { not: 'DELETED' } };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersLoader.byId(userId);

    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }

    return ApiResponse.success(
      this.userMapper.toResponse(user),
    );
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingPhone) {
        throw new ConflictException(
          UserMessages.PHONE_ALREADY_USED,
        );
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
      select: this.userSelect(),
    });
    return ApiResponse.updated(
      this.userMapper.toResponse(updatedUser),
      UserMessages.UPDATED,
    );

  }

  async findAll(query: QueryUsersDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: this.userSelect(),
    });

    const total = await this.prisma.user.count({ where });

    return ApiResponse.paginated(
      this.userMapper.toList(users),

      {
        total,

        page,

        limit,

        totalPages:
          Math.ceil(total / limit),
      },
    );
  }




  async findOne(id: string) {
    const user = await this.usersLoader.activeById(id);

    if (!user) {
      throw new NotFoundException(
        UserMessages.NOT_FOUND,
      );
    }

    return ApiResponse.success(
      this.userMapper.toResponse(user),
    );
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        status: {
          not: 'DELETED',
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable.',
      );
    }

    if (dto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: {
            id,
          },
        },
      });

      if (existingEmail) {
        throw new ConflictException(
          UserMessages.EMAIL_ALREADY_USED,
        );
      }
    }

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          NOT: {
            id,
          },
        },
      });

      if (existingPhone) {
        throw new ConflictException(
          UserMessages.PHONE_ALREADY_USED,
        );
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: dto,
      select: {
        ...this.userSelect(),
      },
    });

    return ApiResponse.updated(
      this.userMapper.toResponse(updatedUser),
      UserMessages.UPDATED,
    );
  }

  async updateStatus(
    id: string,
    dto: UpdateUserStatusDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        status: {
          not: 'DELETED',
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        UserMessages.NOT_FOUND,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: dto.status,
      },
      select: {
        ...this.userSelect(),
      },
    });

    return ApiResponse.updated(
      this.userMapper.toResponse(updatedUser),
      UserMessages.UPDATED,
    );
  }

  async updateRole(
    currentUserId: string,
    id: string,
    dto: UpdateUserRoleDto,
  ) {
    // Empêcher un administrateur de modifier son propre rôle
    if (currentUserId === id) {
      throw new ForbiddenException(
        UserMessages.CANNOT_DELETE_YOURSELF,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        status: {
          not: 'DELETED',
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        UserMessages.NOT_FOUND,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        role: dto.role,
      },
      select: {
        ...this.userSelect(),
      },
    });

    return ApiResponse.updated(
      this.userMapper.toResponse(updatedUser),
      UserMessages.UPDATED,
    );
  }

  async delete(
    currentUserId: string,
    id: string,
  ) {
    // Empêcher un administrateur de se supprimer lui-même
    if (currentUserId === id) {
      throw new ForbiddenException(
        UserMessages.CANNOT_DELETE_YOURSELF,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        status: {
          not: 'DELETED',
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        UserMessages.NOT_FOUND,
      );
    }

    if (user.status === 'DELETED') {
      throw new ConflictException(
        'Cet utilisateur est déjà supprimé.',
      );
    }

    const deletedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: 'DELETED',
      },
      select: {
        ...this.userSelect(),
      },
    });

    return ApiResponse.deleted(
      this.userMapper.toResponse(deletedUser),
      UserMessages.DELETED,
    );
  }
}