import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  ApiAuth,
  ApiCreated,
  ApiPagination,
  ApiStandardResponses,
  ApiUpdated,
} from '../common/swagger';

import { MembershipsService } from './memberships.service';

import { CreateMembershipDto } from './dto/requests/create-membership.dto';
import { QueryMembershipsDto } from './dto/requests/query-memberships.dto';
import { UpdateMembershipRoleDto } from './dto/requests/update-membership-role.dto';
import { UpdateMembershipStatusDto } from './dto/requests/update-membership-status.dto';

import { MembershipResponseDto } from './dto/responses/membership-response.dto';
import { MembershipListItemDto } from './dto/responses/membership-list-item.dto';

@ApiTags('Memberships')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('tontines/:tontineId/members')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Ajouter un membre à la tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiCreated(
    MembershipResponseDto,
    'Membre ajouté avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Requête invalide.',
    notFound: 'Tontine ou utilisateur introuvable.',
    conflict: 'Cet utilisateur est déjà membre de la tontine.',
  })
  create(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Body()
    dto: CreateMembershipDto,
  ) {
    return this.membershipsService.create(
      tontineId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les membres de la tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiPagination(
    MembershipListItemDto,
    'Liste paginée des membres.',
  )
  @ApiStandardResponses({
    notFound: 'Tontine introuvable.',
  })
  findAll(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Query()
    query: QueryMembershipsDto,
  ) {
    return this.membershipsService.findAll(
      tontineId,
      query,
    );
  }

  @Get(':membershipId')
  @ApiOperation({
    summary: "Obtenir les détails d'une adhésion",
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'membershipId',
    description: "Identifiant UUID de l'adhésion",
  })
  @ApiUpdated(
    MembershipResponseDto,
    "Détails de l'adhésion.",
  )
  @ApiStandardResponses({
    notFound: 'Adhésion introuvable.',
  })
  findOne(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,
  ) {
    return this.membershipsService.findOne(
      tontineId,
      membershipId,
    );
  }

  @Patch(':membershipId/role')
  @ApiOperation({
    summary: "Modifier le rôle d'un membre",
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'membershipId',
    description: "Identifiant UUID de l'adhésion",
  })
  @ApiUpdated(
    MembershipResponseDto,
    'Rôle mis à jour avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Rôle invalide.',
    notFound: 'Adhésion introuvable.',
  })
  updateRole(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,

    @Body()
    dto: UpdateMembershipRoleDto,
  ) {
    return this.membershipsService.updateRole(
      tontineId,
      membershipId,
      dto,
    );
  }

  @Patch(':membershipId/status')
  @ApiOperation({
    summary: "Modifier le statut d'un membre",
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'membershipId',
    description: "Identifiant UUID de l'adhésion",
  })
  @ApiUpdated(
    MembershipResponseDto,
    'Statut mis à jour avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Statut invalide.',
    notFound: 'Adhésion introuvable.',
  })
  updateStatus(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,

    @Body()
    dto: UpdateMembershipStatusDto,
  ) {
    return this.membershipsService.updateStatus(
      tontineId,
      membershipId,
      dto,
    );
  }

  @Delete(':membershipId')
  @ApiOperation({
    summary: 'Retirer un membre de la tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'membershipId',
    description: "Identifiant UUID de l'adhésion",
  })
  @ApiUpdated(
    MembershipResponseDto,
    'Membre retiré avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Impossible de retirer ce membre.',
    notFound: 'Adhésion introuvable.',
  })
  remove(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,
  ) {
    return this.membershipsService.remove(
      tontineId,
      membershipId,
    );
  }
}