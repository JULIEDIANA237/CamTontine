import { Injectable } from '@nestjs/common';

import { MembershipRole, MembershipStatus, Prisma } from '@prisma/client';

import { BaseMapper } from '../../common/mappers';

import { MembershipResponseDto } from '../dto/responses/membership-response.dto';
import { MembershipListItemDto } from '../dto/responses/membership-list-item.dto';
import { BasicMembershipDto } from '../../common/dto/responses/basic-membership.dto';


export type MembershipWithRelations =
  Prisma.MembershipGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          firstName: true;
          lastName: true;
          email: true;
        };
      };

      tontine: {
        select: {
          id: true;
          name: true;
        };
      };
    };
  }>;


@Injectable()
export class MembershipMapper extends BaseMapper<
  MembershipWithRelations,
  MembershipResponseDto,
  MembershipListItemDto
> {

  /**
   * Transformation basique adhésion (BasicMembershipDto)
   */
  toBasic(membership: {
    id: string;
    userId: string;
    tontineId: string;
    role: MembershipRole;
    status: MembershipStatus;
  }): BasicMembershipDto {
    return {
      id: membership.id,
      userId: membership.userId,
      tontineId: membership.tontineId,
      role: membership.role,
      status: membership.status,
    };
  }

  /**
   * Transformation complète d'une Membership
   */
  override toResponse(
    membership: MembershipWithRelations,
  ): MembershipResponseDto {

    return {

      id: membership.id,


      user: {

        id:
          membership.user.id,

        firstName:
          membership.user.firstName,

        lastName:
          membership.user.lastName,

        email:
          membership.user.email,
      },


      tontine: {

        id:
          membership.tontine.id,

        name:
          membership.tontine.name,
      },


      role:
        membership.role,


      status:
        membership.status,


      joinedAt:
        membership.joinedAt,


      leftAt:
        membership.leftAt,


      createdAt:
        membership.createdAt,


      updatedAt:
        membership.updatedAt,
    };
  }



  /**
   * Transformation légère pour les listes
   */
  toListItem(
    membership: MembershipWithRelations,
  ): MembershipListItemDto {

    return {

      id:
        membership.id,


      firstName:
        membership.user.firstName,


      lastName:
        membership.user.lastName,


      email:
        membership.user.email,


      role:
        membership.role,


      status:
        membership.status,


      joinedAt:
        membership.joinedAt,
    };
  }

}