import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import {
  ApiAuth,
  ApiCreated,
  ApiPagination,
  ApiStandardResponses,
  ApiUpdated,
} from '../common/swagger';

import { TontinesService } from './tontines.service';

import { CreateTontineDto } from './dto/create-tontine.dto';
import { QueryTontinesDto } from './dto/query-tontines.dto';
import { UpdateTontineDto } from './dto/update-tontine.dto';

import { TontineResponseDto } from './dto/responses/tontine-response.dto';
import { TontineListItemDto } from './dto/responses/tontine-list-item.dto';

@ApiTags('Tontines')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('tontines')
export class TontinesController {
  constructor(
    private readonly tontinesService: TontinesService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Créer une tontine',
  })
  @ApiCreated(
    TontineResponseDto,
    'Tontine créée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Données invalides.',
    conflict: 'Une tontine identique existe déjà.',
  })
  create(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    dto: CreateTontineDto,
  ) {
    return this.tontinesService.create(
      user.sub,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les tontines',
  })
  @ApiPagination(
    TontineListItemDto,
    'Liste paginée des tontines.',
  )
  @ApiStandardResponses()
  findAll(
    @Query()
    query: QueryTontinesDto,
  ) {
    return this.tontinesService.findAll(
      query,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir une tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Détails de la tontine.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  findOne(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.findOne(
      id,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour une tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Tontine mise à jour.',
  )
  @ApiStandardResponses({
    badRequest:
      'Les données sont invalides.',
    notFound:
      'Tontine introuvable.',
  })
  update(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

    @Body()
    dto: UpdateTontineDto,
  ) {
    return this.tontinesService.update(
      id,
      dto,
    );
  }

  @Patch(':id/open-recruitment')
  @ApiOperation({
    summary:
      'Ouvrir le recrutement',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Recrutement ouvert.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  openRecruitment(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.openRecruitment(
      id,
    );
  }

  @Patch(':id/start')
  @ApiOperation({
    summary:
      'Démarrer la tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Tontine démarrée.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  start(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.start(
      id,
    );
  }

  @Patch(':id/suspend')
  @ApiOperation({
    summary:
      'Suspendre la tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Tontine suspendue.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  suspend(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.suspend(
      id,
    );
  }

  @Patch(':id/resume')
  @ApiOperation({
    summary:
      'Reprendre la tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Tontine reprise.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  resume(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.resume(
      id,
    );
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary:
      'Terminer la tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Tontine terminée.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  complete(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.complete(
      id,
    );
  }

  @Patch(':id/archive')
  @ApiOperation({
    summary:
      'Archiver la tontine',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identifiant UUID de la tontine',
  })
  @ApiUpdated(
    TontineResponseDto,
    'Tontine archivée.',
  )
  @ApiStandardResponses({
    notFound:
      'Tontine introuvable.',
  })
  archive(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.tontinesService.archive(
      id,
    );
  }
}