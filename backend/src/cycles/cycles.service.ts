import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  Tontine,
  TontineStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { CycleMessages } from '../common/messages/cycles.messages';
import { CycleMapper } from './mappers/cycle.mapper';
import { CycleLoader } from './loaders/cycle.loader';

import { CreateCycleDto } from './dto/requests/create-cycle.dto';
import { UpdateCycleDto } from './dto/requests/update-cycle.dto';
import { FindCyclesDto } from './dto/requests/find-cycles.dto';
import { OpenCycleDto } from './dto/requests/open-cycle.dto';
import { CloseCycleDto } from './dto/requests/close-cycle.dto';
import { CancelCycleDto } from './dto/requests/cancel-cycle.dto';

import {
  cycleDetailsInclude,
} from './cycle.prisma';

@Injectable()
export class CyclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cycleMapper: CycleMapper,
    private readonly cycleLoader: CycleLoader,
  ) { }

  private async getCycleWithRelations(
    db: PrismaService | Prisma.TransactionClient,
    tontineId: string,
    cycleId: string,
  ) {
    return db.cycle.findFirst({
      where: {
        id: cycleId,
        tontineId,
      },
      include: cycleDetailsInclude,
    });
  }

  private validateCreateCycle(tontine: Tontine) {
    if (tontine.status !== TontineStatus.ACTIVE) {
      throw new BadRequestException(
        'Les cycles ne peuvent être créés que pour une tontine active.',
      );
    }
  }

  /**
   * Créer un nouveau cycle de contribution pour une tontine
   */
  async create(tontineId: string, dto: CreateCycleDto) {
    return this.prisma.$transaction(async (tx) => {
      const tontine = await tx.tontine.findUnique({
        where: { id: tontineId },
      });

      if (!tontine) {
        throw new NotFoundException('Tontine introuvable.');
      }

      this.validateCreateCycle(tontine);

      const currentCycle = await tx.cycle.findFirst({
        where: {
          tontineId,
          isCurrent: true,
        },
      });

      if (currentCycle) {
        throw new ConflictException('Un cycle est déjà en cours.');
      }

      const existingCycle = await tx.cycle.findUnique({
        where: {
          tontineId_number: {
            tontineId,
            number: dto.number,
          },
        },
      });

      if (existingCycle) {
        throw new ConflictException('Ce numéro de cycle existe déjà.');
      }

      const activeMembers = await tx.membership.count({
        where: {
          tontineId,
          status: 'ACTIVE',
        },
      });

      if (activeMembers < tontine.minimumMembers) {
        throw new BadRequestException(
          "Le nombre minimum de membres n'est pas atteint.",
        );
      }

      const expectedAmount = Number(tontine.contributionAmount) * activeMembers;

      const createdCycle = await tx.cycle.create({
        data: {
          tontineId,
          number: dto.number,
          name: dto.name,
          startDate: new Date(dto.startDate),
          dueDate: new Date(dto.dueDate),
          expectedAmount,
          collectedAmount: 0,
          status: 'PENDING',
          isCurrent: false,
        },
      });

      const result = await this.getCycleWithRelations(tx, tontineId, createdCycle.id);

      if (!result) {
        throw new NotFoundException('Cycle introuvable après création.');
      }

      return ApiResponse.created(
        this.cycleMapper.toResponse(result),
        CycleMessages.CREATED,
      );
    });
  }

  /**
   * Lister les cycles d'une tontine avec pagination et filtres
   */
  async findAll(tontineId: string, query: FindCyclesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CycleWhereInput = {
      tontineId,
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.isCurrent !== undefined) {
      where.isCurrent = query.isCurrent;
    }

    if (query.search?.trim()) {
      where.name = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    const [cycles, total] = await Promise.all([
      this.cycleLoader.findMany(where, skip, limit),
      this.cycleLoader.count(where),
    ]);

    return ApiResponse.success(
      this.cycleMapper.toPaginatedResponse(cycles, {
        page,
        limit,
        total,
      }),
      CycleMessages.LIST,
    );
  }

  /**
   * Récupérer le cycle en cours pour une tontine
   */
  async findCurrent(tontineId: string) {
    const cycle = await this.cycleLoader.findCurrent(tontineId);

    if (!cycle) {
      throw new NotFoundException('Aucun cycle actuellement en cours pour cette tontine.');
    }

    return ApiResponse.success(
      this.cycleMapper.toResponse(cycle),
      CycleMessages.CURRENT,
    );
  }

  /**
   * Récupérer un cycle par son ID
   */
  async findOne(tontineId: string, cycleId: string) {
    const cycle = await this.cycleLoader.findByIdAndTontine(tontineId, cycleId);

    if (!cycle) {
      throw new NotFoundException('Cycle introuvable.');
    }

    return ApiResponse.success(
      this.cycleMapper.toResponse(cycle),
      CycleMessages.FOUND,
    );
  }

  /**
   * Mettre à jour un cycle
   */
  async update(tontineId: string, cycleId: string, dto: UpdateCycleDto) {
    const cycle = await this.cycleLoader.findByIdAndTontine(tontineId, cycleId);

    if (!cycle) {
      throw new NotFoundException('Cycle introuvable.');
    }

    if (cycle.status === 'CLOSED' || cycle.status === 'CANCELLED') {
      throw new BadRequestException('Impossible de modifier un cycle clôturé ou annulé.');
    }

    const data: Prisma.CycleUpdateInput = {};

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.dueDate) {
      data.dueDate = new Date(dto.dueDate);
    }

    await this.prisma.cycle.update({
      where: { id: cycleId },
      data,
    });

    const result = await this.cycleLoader.findByIdAndTontine(tontineId, cycleId);

    if (!result) {
      throw new NotFoundException('Cycle introuvable après mise à jour.');
    }

    return ApiResponse.success(
      this.cycleMapper.toResponse(result),
      CycleMessages.UPDATED,
    );
  }

  /**
   * Ouvrir un cycle (passer le statut à OPEN et isCurrent à true)
   */
  async openCycle(tontineId: string, cycleId: string, _dto?: OpenCycleDto) {
    return this.prisma.$transaction(async (tx) => {
      const cycle = await tx.cycle.findFirst({
        where: { id: cycleId, tontineId },
      });

      if (!cycle) {
        throw new NotFoundException('Cycle introuvable.');
      }

      if (cycle.status !== 'PENDING') {
        throw new BadRequestException('Seul un cycle en attente (PENDING) peut être ouvert.');
      }

      const activeCurrentCycle = await tx.cycle.findFirst({
        where: { tontineId, isCurrent: true },
      });

      if (activeCurrentCycle) {
        throw new ConflictException('Un autre cycle est déjà en cours d’exécution.');
      }

      await tx.cycle.update({
        where: { id: cycleId },
        data: {
          status: 'OPEN',
          isCurrent: true,
          openedAt: new Date(),
        },
      });

      const result = await this.getCycleWithRelations(tx, tontineId, cycleId);

      if (!result) {
        throw new NotFoundException('Cycle introuvable après ouverture.');
      }

      return ApiResponse.success(
        this.cycleMapper.toResponse(result),
        CycleMessages.OPENED,
      );
    });
  }

  /**
   * Clôturer un cycle (passer le statut à CLOSED et isCurrent à false)
   */
  async closeCycle(tontineId: string, cycleId: string, _dto?: CloseCycleDto) {
    return this.prisma.$transaction(async (tx) => {
      const cycle = await tx.cycle.findFirst({
        where: { id: cycleId, tontineId },
      });

      if (!cycle) {
        throw new NotFoundException('Cycle introuvable.');
      }

      if (cycle.status !== 'OPEN') {
        throw new BadRequestException('Seul un cycle ouvert (OPEN) peut être clôturé.');
      }

      await tx.cycle.update({
        where: { id: cycleId },
        data: {
          status: 'CLOSED',
          isCurrent: false,
          closedAt: new Date(),
        },
      });

      const result = await this.getCycleWithRelations(tx, tontineId, cycleId);

      if (!result) {
        throw new NotFoundException('Cycle introuvable après clôture.');
      }

      return ApiResponse.success(
        this.cycleMapper.toResponse(result),
        CycleMessages.CLOSED,
      );
    });
  }

  /**
   * Annuler un cycle
   */
  async cancelCycle(tontineId: string, cycleId: string, _dto?: CancelCycleDto) {
    return this.prisma.$transaction(async (tx) => {
      const cycle = await tx.cycle.findFirst({
        where: { id: cycleId, tontineId },
      });

      if (!cycle) {
        throw new NotFoundException('Cycle introuvable.');
      }

      if (cycle.status === 'CLOSED') {
        throw new BadRequestException('Un cycle déjà clôturé ne peut pas être annulé.');
      }

      await tx.cycle.update({
        where: { id: cycleId },
        data: {
          status: 'CANCELLED',
          isCurrent: false,
        },
      });

      const result = await this.getCycleWithRelations(tx, tontineId, cycleId);

      if (!result) {
        throw new NotFoundException('Cycle introuvable après annulation.');
      }

      return ApiResponse.success(
        this.cycleMapper.toResponse(result),
        CycleMessages.CANCELLED,
      );
    });
  }
}
