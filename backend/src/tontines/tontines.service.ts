import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, TontineStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTontineDto } from './dto/create-tontine.dto';
import { QueryTontinesDto } from './dto/query-tontines.dto';

import { TontineMapper } from './mappers/tontine.mapper';
import { UpdateTontineDto } from './dto/update-tontine.dto';
import { UpdateTontineStatusDto } from './dto/update-tontine-status.dto';

@Injectable()
export class TontinesService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Relations à charger systématiquement pour les réponses API.
   */
  private readonly tontineInclude = {
    creator: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    _count: {
      select: {
        memberships: true,
      },
    },
  } satisfies Prisma.TontineInclude;

  /**
   * Vérifie qu’une tontine pouvant être modifiée n’est pas dans un
   * état bloquant.
   */
  private validateTontineCanBeUpdated(status: TontineStatus): void {
    switch (status) {
      case 'ACTIVE':
        throw new BadRequestException(
          'Une tontine active ne peut plus être modifiée.',
        );
      case 'SUSPENDED':
        throw new BadRequestException(
          'Une tontine suspendue ne peut pas être modifiée.',
        );
      case 'COMPLETED':
        throw new BadRequestException(
          'Une tontine terminée ne peut plus être modifiée.',
        );
      case 'ARCHIVED':
        throw new BadRequestException(
          'Une tontine archivée ne peut plus être modifiée.',
        );
    }
  }

  /**
   * Construit dynamiquement les filtres de recherche.
   */
  private buildWhereClause(
    query: QueryTontinesDto,
  ): Prisma.TontineWhereInput {
    const where: Prisma.TontineWhereInput = {
      status: { not: 'ARCHIVED' },
    };

    if (query.search?.trim()) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.frequency) {
      where.frequency = query.frequency;
    }

    return where;
  }

  /**
   * Charge une tontine avec toutes les relations nécessaires pour les
   * réponses API.
   */
  private async getTontineWithRelations(
    db: Prisma.TransactionClient | PrismaService,
    tontineId: string,
  ) {
    return db.tontine.findUnique({
      where: { id: tontineId },
      include: this.tontineInclude,
    });
  }

  private readonly statusTransitions: Record<
    TontineStatus,
    TontineStatus[]
  > = {
      DRAFT: ['RECRUITING'],

      RECRUITING: ['READY'],

      READY: ['ACTIVE'],

      ACTIVE: [
        'SUSPENDED',
        'COMPLETED',
      ],

      SUSPENDED: [
        'ACTIVE',
        'ARCHIVED',
      ],

      COMPLETED: [
        'ARCHIVED',
      ],

      ARCHIVED: [],
    };

  private validateStatusTransition(
    current: TontineStatus,
    next: TontineStatus,
  ): void {
    const allowed =
      this.statusTransitions[current];

    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Transition impossible : ${current} → ${next}`,
      );
    }
  }

  private async changeStatus(
    id: string,
    nextStatus: TontineStatus,
  ) {
    const tontine = await this.getTontineWithRelations(
      this.prisma,
      id,
    );

    if (!tontine) {
      throw new NotFoundException(
        'Tontine introuvable.',
      );
    }

    this.validateStatusTransition(
      tontine.status,
      nextStatus,
    );

    await this.prisma.tontine.update({
      where: {
        id,
      },
      data: {
        status: nextStatus,
      },
    });

    const updated =
      await this.getTontineWithRelations(
        this.prisma,
        id,
      );

      if (!updated) {
        throw new NotFoundException('Tontine introuvable après mise à jour.');
      }
      return {
        success: true,
        message: 'Statut mis à jour.',
      data: new TontineMapper().toResponse(updated),
      };
  }

  async create(creatorId: string, dto: CreateTontineDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.minimumMembers > dto.maximumMembers) {
        throw new BadRequestException(
          'Le nombre maximum de membres doit être supérieur ou égal au minimum.',
        );
      }

      const tontine = await tx.tontine.create({
        data: {
          name: dto.name,
          description: dto.description,
          contributionAmount: new Prisma.Decimal(dto.contributionAmount),
          frequency: dto.frequency,
          minimumMembers: dto.minimumMembers,
          maximumMembers: dto.maximumMembers,
          startDate: dto.startDate ? new Date(dto.startDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          creatorId,
        },
      });

      await tx.membership.create({
        data: {
          userId: creatorId,
          tontineId: tontine.id,
          role: 'MANAGER',
          status: 'ACTIVE',
        },
      });

        const createdTontine = await this.getTontineWithRelations(tx, tontine.id);
        if (!createdTontine) {
          throw new NotFoundException('Tontine introuvable après création.');
        }
        return {
          success: true,
          message: 'Tontine créée avec succès.',
          data: new TontineMapper().toResponse(createdTontine),
        };
    });
  }

  async findAll(query: QueryTontinesDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(query);

    const [tontines, total] = await this.prisma.$transaction([
      this.prisma.tontine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.tontineInclude, // <-- utilisation du helper centralisé
      }),
      this.prisma.tontine.count({ where }),
    ]);

    return {
      success: true,
      data: tontines.map((t) => new TontineMapper().toResponse(t)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const tontine = await this.getTontineWithRelations(this.prisma, id);

    if (!tontine || tontine.status === 'ARCHIVED') {
      throw new NotFoundException('Tontine introuvable.');
    }

    return {
      success: true,
      data: new TontineMapper().toResponse(tontine),
    };
  }

  async update(id: string, dto: UpdateTontineDto) {
    const tontine = await this.getTontineWithRelations(this.prisma, id);

    if (!tontine) {
      throw new NotFoundException('Tontine introuvable.');
    }

    this.validateTontineCanBeUpdated(tontine.status);

    if (
      dto.startDate &&
      dto.endDate &&
      new Date(dto.endDate) < new Date(dto.startDate)
    ) {
      throw new BadRequestException(
        'La date de fin doit être postérieure à la date de début.',
      );
    }

    if (dto.contributionAmount !== undefined && dto.contributionAmount <= 0) {
      throw new BadRequestException(
        'Le montant de cotisation doit être supérieur à zéro.',
      );
    }

    if (dto.minimumMembers !== undefined && dto.minimumMembers < 2) {
      throw new BadRequestException(
        'Une tontine doit contenir au moins deux membres.',
      );
    }

    if (
      dto.minimumMembers !== undefined &&
      dto.maximumMembers !== undefined &&
      dto.minimumMembers > dto.maximumMembers
    ) {
      throw new BadRequestException(
        'Le nombre maximum de membres doit être supérieur ou égal au minimum.',
      );
    }

    const updated = await this.prisma.tontine.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        contributionAmount:
          dto.contributionAmount !== undefined
            ? new Prisma.Decimal(dto.contributionAmount)
            : undefined,
        frequency: dto.frequency,
        minimumMembers: dto.minimumMembers,
        maximumMembers: dto.maximumMembers,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });

      const result = await this.getTontineWithRelations(this.prisma, updated.id);
      if (!result) {
        throw new NotFoundException('Tontine introuvable après mise à jour.');
      }
      return {
        success: true,
        message: 'Tontine mise à jour avec succès.',
        data: new TontineMapper().toResponse(result),
      };
  }

  async updateStatus(
    id: string,
    dto: UpdateTontineStatusDto,
  ) {
    const tontine =
      await this.getTontineWithRelations(
        this.prisma,
        id,
      );

    if (!tontine) {
      throw new NotFoundException(
        'Tontine introuvable.',
      );
    }

    this.validateStatusTransition(
      tontine.status,
      dto.status,
    );

    await this.prisma.tontine.update({
      where: {
        id,
      },
      data: {
        status: dto.status,
      },
    });

    const updated =
      await this.getTontineWithRelations(
        this.prisma,
        id,
      );

    return {
      success: true,
      message:
        'Statut mis à jour avec succès.',
      data: new TontineMapper().toResponse(updated!),
    };
  }

  async openRecruitment(id: string) {
    return this.changeStatus(
      id,
      TontineStatus.RECRUITING,
    );
  }

  async start(id: string) {
    const membershipCount =
      await this.prisma.membership.count({
        where: {
          tontineId: id,
          status: 'ACTIVE',
        },
      });

    const tontine =
      await this.prisma.tontine.findUnique({
        where: { id },
      });

    if (!tontine) {
      throw new NotFoundException(
        'Tontine introuvable.',
      );
    }

    if (
      membershipCount <
      tontine.minimumMembers
    ) {
      throw new BadRequestException(
        'Le nombre minimum de membres n’est pas atteint.',
      );
    }

    if (!tontine.startDate) {
      throw new BadRequestException(
        'La date de début doit être définie.',
      );
    }

    return this.changeStatus(
      id,
      TontineStatus.ACTIVE,
    );
  }

  async suspend(id: string) {
    return this.changeStatus(
      id,
      TontineStatus.SUSPENDED,
    );
  }

  async resume(id: string) {
    return this.changeStatus(
      id,
      TontineStatus.ACTIVE,
    );
  }

  async complete(id: string) {
    return this.changeStatus(
      id,
      TontineStatus.COMPLETED,
    );
  }

  async archive(id: string) {
    return this.changeStatus(
      id,
      TontineStatus.ARCHIVED,
    );
  }
}
