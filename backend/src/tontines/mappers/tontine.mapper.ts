import { Injectable } from '@nestjs/common';

import { BaseMapper } from '../../common/mappers';

import { TontineWithRelations } from '../tontine.prisma';

import { TontineResponseDto } from '../dto/responses/tontine-response.dto';
import { TontineListItemDto } from '../dto/responses/tontine-list-item.dto';
import { BasicTontineDto } from '../../common/dto/responses/basic-tontine.dto';

@Injectable()
export class TontineMapper extends BaseMapper<
  TontineWithRelations,
  TontineResponseDto,
  TontineListItemDto
> {
  /**
   * Transformation basique tontine (BasicTontineDto)
   */
  toBasic(tontine: { id: string; name: string }): BasicTontineDto {
    return {
      id: tontine.id,
      name: tontine.name,
    };
  }

  override toResponse(
    tontine: TontineWithRelations,
  ): TontineResponseDto {
    return {
      id: tontine.id,

      name: tontine.name,

      description: tontine.description,

      contributionAmount: Number(
        tontine.contributionAmount,
      ),

      frequency: tontine.frequency,

      minimumMembers: tontine.minimumMembers,

      maximumMembers: tontine.maximumMembers,

      startDate: tontine.startDate,

      endDate: tontine.endDate,

      status: tontine.status,

      createdAt: tontine.createdAt,

      updatedAt: tontine.updatedAt,

      creator: {
        id: tontine.creator.id,

        firstName: tontine.creator.firstName,

        lastName: tontine.creator.lastName,

        email: tontine.creator.email,
      },

      memberCount:
        tontine._count.memberships,
    };
  }

  override toListItem(
    tontine: TontineWithRelations,
  ): TontineListItemDto {
    return {
      id: tontine.id,

      name: tontine.name,

      contributionAmount: Number(
        tontine.contributionAmount,
      ),

      frequency: tontine.frequency,

      status: tontine.status,

      memberCount:
        tontine._count.memberships,

      createdAt: tontine.createdAt,
    };
  }
}