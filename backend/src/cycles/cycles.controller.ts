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

import { CyclesService } from './cycles.service';

import { CreateCycleDto } from './dto/requests/create-cycle.dto';
import { UpdateCycleDto } from './dto/requests/update-cycle.dto';
import { FindCyclesDto } from './dto/requests/find-cycles.dto';
import { OpenCycleDto } from './dto/requests/open-cycle.dto';
import { CloseCycleDto } from './dto/requests/close-cycle.dto';
import { CancelCycleDto } from './dto/requests/cancel-cycle.dto';

import { CycleResponseDto } from './dto/responses/cycle-response.dto';
import { CycleListItemDto } from './dto/responses/cycle-list-item.dto';

@ApiTags('Cycles')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('tontines/:tontineId/cycles')
export class CyclesController {
  constructor(
    private readonly cyclesService: CyclesService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Créer un nouveau cycle',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiCreated(
    CycleResponseDto,
    'Cycle créé avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Données invalides.',
    conflict:
      'Le numéro de cycle existe déjà ou un cycle est déjà ouvert.',
    notFound: 'Tontine introuvable.',
  })
  create(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Body()
    dto: CreateCycleDto,
  ) {
    return this.cyclesService.create(
      tontineId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les cycles',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiPagination(
    CycleListItemDto,
    'Liste paginée des cycles.',
  )
  @ApiStandardResponses({
    notFound: 'Tontine introuvable.',
  })
  findAll(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Query()
    query: FindCyclesDto,
  ) {
    return this.cyclesService.findAll(
      tontineId,
      query,
    );
  }

  @Get('current')
  @ApiOperation({
    summary:
      'Obtenir le cycle actuellement ouvert',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    CycleResponseDto,
    'Cycle courant récupéré avec succès.',
  )
  @ApiStandardResponses({
    notFound:
      'Cycle ou tontine introuvable.',
  })
  findCurrent(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,
  ) {
    return this.cyclesService.findCurrent(
      tontineId,
    );
  }

  @Get(':cycleId')
  @ApiOperation({
    summary:
      "Obtenir les détails d'un cycle",
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiUpdated(
    CycleResponseDto,
    'Cycle récupéré avec succès.',
  )
  @ApiStandardResponses({
    notFound: 'Cycle introuvable.',
  })
  findOne(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,
  ) {
    return this.cyclesService.findOne(
      tontineId,
      cycleId,
    );
  }

  @Patch(':cycleId')
  @ApiOperation({
    summary:
      'Mettre à jour un cycle',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiUpdated(
    CycleResponseDto,
    'Cycle mis à jour avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Données invalides.',
    notFound: 'Cycle introuvable.',
  })
  update(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Body()
    dto: UpdateCycleDto,
  ) {
    return this.cyclesService.update(
      tontineId,
      cycleId,
      dto,
    );
  }

  @Patch(':cycleId/open')
  @ApiOperation({
    summary: 'Ouvrir un cycle',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiUpdated(
    CycleResponseDto,
    'Cycle ouvert avec succès.',
  )
  @ApiStandardResponses({
    conflict:
      'Un autre cycle est déjà ouvert.',
    notFound: 'Cycle introuvable.',
  })
  open(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Body()
    dto?: OpenCycleDto,
  ) {
    return this.cyclesService.openCycle(
      tontineId,
      cycleId,
      dto,
    );
  }

  @Patch(':cycleId/close')
  @ApiOperation({
    summary:
      'Clôturer un cycle',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiUpdated(
    CycleResponseDto,
    'Cycle clôturé avec succès.',
  )
  @ApiStandardResponses({
    badRequest:
      'Toutes les contributions ne sont pas validées.',
    notFound: 'Cycle introuvable.',
  })
  close(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Body()
    dto?: CloseCycleDto,
  ) {
    return this.cyclesService.closeCycle(
      tontineId,
      cycleId,
      dto,
    );
  }

  @Patch(':cycleId/cancel')
  @ApiOperation({
    summary:
      'Annuler un cycle',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiParam({
    name: 'cycleId',
    description: 'Identifiant UUID du cycle',
  })
  @ApiUpdated(
    CycleResponseDto,
    'Cycle annulé avec succès.',
  )
  @ApiStandardResponses({
    badRequest:
      'Le cycle ne peut plus être annulé.',
    notFound: 'Cycle introuvable.',
  })
  cancel(
    @Param('tontineId', ParseUUIDPipe)
    tontineId: string,

    @Param('cycleId', ParseUUIDPipe)
    cycleId: string,

    @Body()
    dto?: CancelCycleDto,
  ) {
    return this.cyclesService.cancelCycle(
      tontineId,
      cycleId,
      dto,
    );
  }
}