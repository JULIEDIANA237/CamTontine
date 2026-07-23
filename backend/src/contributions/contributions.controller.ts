import {
  Body,
  Controller,
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

import { ContributionsService } from './contributions.service';

import { CreateContributionDto } from './dto/requests/create-contribution.dto';
import { UpdateContributionDto } from './dto/requests/update-contribution.dto';
import { FindContributionsDto } from './dto/requests/find-contributions.dto';
import { ValidateContributionDto } from './dto/requests/validate-contribution.dto';
import { CancelContributionDto } from './dto/requests/cancel-contribution.dto';

import { ContributionResponseDto } from './dto/responses/contribution-response.dto';
import { ContributionListItemDto } from './dto/responses/contribution-list-item.dto';

@ApiTags('Contributions')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('tontines/:tontineId/cycles/:cycleId/contributions')
export class ContributionsController {
  constructor(
    private readonly contributionsService: ContributionsService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle contribution',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiCreated(
    ContributionResponseDto,
    'Contribution créée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Données invalides ou cycle non ouvert.',
    conflict: 'Une contribution existe déjà pour ce membre dans ce cycle.',
    notFound: 'Cycle ou membre introuvable.',
  })
  create(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Body()
    dto: CreateContributionDto,
  ) {
    return this.contributionsService.create(
      tontineId,
      cycleId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les contributions d’un cycle',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiPagination(
    ContributionListItemDto,
    'Liste paginée des contributions.',
  )
  @ApiStandardResponses({
    notFound: 'Cycle introuvable.',
  })
  findAll(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Query()
    query: FindContributionsDto,
  ) {
    return this.contributionsService.findAll(
      tontineId,
      cycleId,
      query,
    );
  }

  @Get(':contributionId')
  @ApiOperation({
    summary: "Obtenir les détails d'une contribution",
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiParam({
    name: 'contributionId',
    description: 'Identifiant UUID de la contribution',
  })
  @ApiUpdated(
    ContributionResponseDto,
    'Contribution récupérée avec succès.',
  )
  @ApiStandardResponses({
    notFound: 'Contribution ou cycle introuvable.',
  })
  findOne(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Param('contributionId', ParseUUIDPipe)
    contributionId: string,
  ) {
    return this.contributionsService.findOne(
      tontineId,
      cycleId,
      contributionId,
    );
  }

  @Patch(':contributionId')
  @ApiOperation({
    summary: 'Mettre à jour une contribution',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiParam({
    name: 'contributionId',
    description: 'Identifiant UUID de la contribution',
  })
  @ApiUpdated(
    ContributionResponseDto,
    'Contribution mise à jour avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Données invalides ou statut incompatible.',
    notFound: 'Contribution introuvable.',
  })
  update(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Param('contributionId', ParseUUIDPipe)
    contributionId: string,

    @Body()
    dto: UpdateContributionDto,
  ) {
    return this.contributionsService.update(
      tontineId,
      cycleId,
      contributionId,
      dto,
    );
  }

  @Patch(':contributionId/validate')
  @ApiOperation({
    summary: 'Valider une contribution payée',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiParam({
    name: 'contributionId',
    description: 'Identifiant UUID de la contribution',
  })
  @ApiUpdated(
    ContributionResponseDto,
    'Contribution validée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Seule une contribution payée peut être validée.',
    notFound: 'Contribution introuvable.',
  })
  validate(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Param('contributionId', ParseUUIDPipe)
    contributionId: string,

    @Body()
    dto?: ValidateContributionDto,
  ) {
    return this.contributionsService.validate(
      tontineId,
      cycleId,
      contributionId,
      dto,
    );
  }

  @Patch(':contributionId/cancel')
  @ApiOperation({
    summary: 'Annuler une contribution',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiParam({
    name: 'contributionId',
    description: 'Identifiant UUID de la contribution',
  })
  @ApiUpdated(
    ContributionResponseDto,
    'Contribution annulée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'La contribution ne peut plus être annulée.',
    notFound: 'Contribution introuvable.',
  })
  cancel(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Param('contributionId', ParseUUIDPipe)
    contributionId: string,

    @Body()
    dto?: CancelContributionDto,
  ) {
    return this.contributionsService.cancel(
      tontineId,
      cycleId,
      contributionId,
      dto,
    );
  }
}
