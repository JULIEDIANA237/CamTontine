import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { MembershipMapper } from './mappers/membership.mapper';

import { CreateMembershipDto } from './dto/requests/create-membership.dto';
import { UpdateMembershipRoleDto } from './dto/requests/update-membership-role.dto';
import { UpdateMembershipStatusDto } from './dto/requests/update-membership-status.dto';
import { QueryMembershipsDto } from './dto/requests/query-memberships.dto';
import { MembershipPolicyService } from './policies/membership-policy.service';

@Injectable()
export class MembershipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipMapper: MembershipMapper,
    private readonly membershipPolicy: MembershipPolicyService,
  ) { }

  /**
   * Construction dynamique des filtres.
   */
  private buildWhereClause(
    tontineId: string,
    query: QueryMembershipsDto,
  ): Prisma.MembershipWhereInput {
    const where: Prisma.MembershipWhereInput = {
      tontineId,
    };

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search?.trim()) {
      where.user = {
        OR: [
          {
            firstName: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return where;
  }

  private async getMembershipWithRelations(
    db: Prisma.TransactionClient | PrismaService,
    tontineId: string,
    membershipId: string,
  ) {
    return db.membership.findFirst({
      where: {
        id: membershipId,
        tontineId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tontine: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Création d'un membre
   */
  async create(
    tontineId: string,
    dto: CreateMembershipDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Vérifier la tontine
      const tontine = await tx.tontine.findUnique({
        where: {
          id: tontineId,
        },
      });

      if (!tontine) {
        throw new NotFoundException(
          'Tontine introuvable.',
        );
      }

      // 2. Vérifier le statut de la tontine
      if (
        tontine.status === 'ARCHIVED' ||
        tontine.status === 'COMPLETED'
      ) {
        throw new BadRequestException(
          "Impossible d'ajouter des membres à cette tontine.",
        );
      }

      // 3. Vérifier l'utilisateur
      const user = await tx.user.findUnique({
        where: {
          id: dto.userId,
        },
      });

      if (!user || user.status === 'DELETED') {
        throw new NotFoundException(
          'Utilisateur introuvable.',
        );
      }

      // 4. Vérifier si déjà membre
      const existingMembership =
        await tx.membership.findUnique({
          where: {
            userId_tontineId: {
              userId: dto.userId,
              tontineId,
            },
          },
        });

      if (existingMembership) {
        throw new ConflictException(
          'Cet utilisateur est déjà membre de cette tontine.',
        );
      }

      // 5. Vérifier le nombre maximal
      const memberCount =
        await tx.membership.count({
          where: {
            tontineId,
            status: 'ACTIVE',
          },
        });

      if (
        memberCount >= tontine.maximumMembers
      ) {
        throw new BadRequestException(
          'La tontine a atteint son nombre maximal de membres.',
        );
      }

      // 6. Création
      const membership =
        await tx.membership.create({
          data: {
            userId: dto.userId,
            tontineId,
            role: dto.role,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            tontine: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

      // 7. Passage automatique à READY
      const totalMembers = memberCount + 1;

      if (
        tontine.status === 'RECRUITING' &&
        totalMembers >= tontine.minimumMembers
      ) {
        await tx.tontine.update({
          where: {
            id: tontine.id,
          },
          data: {
            status: 'READY',
          },
        });
      }

      return {
        success: true,
        message:
          'Membre ajouté avec succès.',
        data:
          this.membershipMapper.toResponse(
            membership,
          ),
      };
    });
  }

  /**
   * Liste des membres d'une tontine
   */
  async findAll(
    tontineId: string,
    query: QueryMembershipsDto,
  ) {
    const page = Number(query.page ?? 1);

    const limit = Number(query.limit ?? 10);

    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(
      tontineId,
      query,
    );

    const [memberships, total] =
      await this.prisma.$transaction([
        this.prisma.membership.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            joinedAt: 'asc',
          },

          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },

            tontine: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),

        this.prisma.membership.count({
          where,
        }),
      ]);

    return {
      success: true,

      data:
        this.membershipMapper.toList(
          memberships,
        ),

      meta: {
        total,

        page,

        limit,

        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  /**
   * Détail d'un membre
   */
  async findOne(
    tontineId: string,
    membershipId: string,
  ) {
    const membership =
      await this.getMembershipWithRelations(
        this.prisma,
        tontineId,
        membershipId,
      );

    if (!membership) {
      throw new NotFoundException(
        'Membre introuvable.',
      );
    }

    return {
      success: true,
      data: this.membershipMapper.toResponse(
        membership,
      ),
    };
  }

  /**
   * Changer le rôle
   */
  async updateRole(
    tontineId: string,
    membershipId: string,
    dto: UpdateMembershipRoleDto,
  ) {
    const membership =
      await this.getMembershipWithRelations(
        this.prisma,
        tontineId,
        membershipId,
      );

    if (!membership) {
      throw new NotFoundException(
        'Membre introuvable.',
      );
    }

    if (membership.role === dto.role) {
      throw new ConflictException(
        'Ce membre possède déjà ce rôle.',
      );
    }

    await this.prisma.membership.update({
      where: {
        id: membership.id,
      },
      data: {
        role: dto.role,
      },
    });

    const updatedMembership =
      await this.getMembershipWithRelations(
        this.prisma,
        tontineId,
        membershipId,
      );

    return {
      success: true,
      message: 'Rôle mis à jour avec succès.',
      data: this.membershipMapper.toResponse(
        updatedMembership!,
      ),
    };
  }

  /**
   * Changer le statut
   */
  async updateStatus(
    tontineId: string,
    membershipId: string,
    dto: UpdateMembershipStatusDto,
  ) {
    const membership =
      await this.getMembershipWithRelations(
        this.prisma,
        tontineId,
        membershipId,
      );

    if (!membership) {
      throw new NotFoundException(
        'Membre introuvable.',
      );
    }

    if (membership.status === dto.status) {
      throw new ConflictException(
        'Ce membre possède déjà ce statut.',
      );
    }

    await this.prisma.membership.update({
      where: {
        id: membership.id,
      },
      data: {
        status: dto.status,
      },
    });

    const updatedMembership =
      await this.getMembershipWithRelations(
        this.prisma,
        tontineId,
        membershipId,
      );

    return {
      success: true,
      message: 'Statut mis à jour avec succès.',
      data: this.membershipMapper.toResponse(
        updatedMembership!,
      ),
    };
  }

  /**
   * Retirer un membre
   */
  async remove(
    tontineId: string,
    membershipId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const membership =
        await this.getMembershipWithRelations(
          tx,
          tontineId,
          membershipId,
        );

      if (!membership) {
        throw new NotFoundException(
          'Membre introuvable.',
        );
      }

      // Déjà retiré
      if (
        membership.status === 'LEFT' ||
        membership.status === 'REMOVED'
      ) {
        throw new ConflictException(
          'Ce membre ne fait plus partie de la tontine.',
        );
      }

      // Informations de la tontine
      const tontine =
        await tx.tontine.findUnique({
          where: {
            id: tontineId,
          },
          select: {
            creatorId: true,
          },
        });

      if (!tontine) {
        throw new NotFoundException(
          'Tontine introuvable.',
        );
      }

      // Nombre de MANAGER actifs
      const managerCount =
        await tx.membership.count({
          where: {
            tontineId,
            role: 'MANAGER',
            status: 'ACTIVE',
          },
        });

      // Empêcher de supprimer le dernier manager
      if (
        membership.role === 'MANAGER' &&
        managerCount === 1
      ) {
        throw new BadRequestException(
          'Impossible de retirer le dernier MANAGER de la tontine.',
        );
      }

      // Empêcher de retirer le créateur tant qu'il est le seul manager
      if (
        membership.user.id === tontine.creatorId &&
        membership.role === 'MANAGER' &&
        managerCount === 1
      ) {
        throw new BadRequestException(
          "Le créateur de la tontine doit d'abord transférer la gestion à un autre MANAGER.",
        );
      }

      // Suppression logique
      await tx.membership.update({
        where: {
          id: membership.id,
        },
        data: {
          status: 'REMOVED',
          leftAt: new Date(),
        },
      });

      const updatedMembership =
        await this.getMembershipWithRelations(
          tx,
          tontineId,
          membershipId,
        );

      return {
        success: true,
        message:
          'Le membre a été retiré avec succès.',
        data: this.membershipMapper.toResponse(
          updatedMembership!,
        ),
      };
    });
  }
}