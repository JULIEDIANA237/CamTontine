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

import { PenaltiesService } from './penalties.service';
import { CreatePenaltyDto } from './dto/requests/create-penalty.dto';
import { FindPenaltiesDto } from './dto/requests/find-penalties.dto';
import { PenaltyResponseDto } from './dto/responses/penalty-response.dto';
import { PenaltyListItemDto } from './dto/responses/penalty-list-item.dto';

@ApiTags('Penalties')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('penalties')
export class PenaltiesController {
  constructor(private readonly penaltiesService: PenaltiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Appliquer une pénalité à une contribution',
  })
  @ApiCreated(
    PenaltyResponseDto,
    'Pénalité créée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Contribution introuvable.',
    conflict: 'Une pénalité existe déjà pour cette contribution.',
  })
  create(@Body() dto: CreatePenaltyDto) {
    return this.penaltiesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les pénalités',
  })
  @ApiPagination(
    PenaltyListItemDto,
    'Liste paginée des pénalités.',
  )
  findAll(@Query() query: FindPenaltiesDto) {
    return this.penaltiesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Obtenir les détails d'une pénalité",
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de la pénalité',
  })
  @ApiUpdated(
    PenaltyResponseDto,
    'Pénalité récupérée avec succès.',
  )
  @ApiStandardResponses({
    notFound: 'Pénalité introuvable.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.penaltiesService.findOne(id);
  }

  @Patch(':id/pay')
  @ApiOperation({
    summary: 'Marquer une pénalité comme payée',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de la pénalité',
  })
  @ApiUpdated(
    PenaltyResponseDto,
    'Pénalité réglée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Statut de la pénalité invalide.',
    notFound: 'Pénalité introuvable.',
  })
  markAsPaid(@Param('id', ParseUUIDPipe) id: string) {
    return this.penaltiesService.markAsPaid(id);
  }

  @Patch(':id/waive')
  @ApiOperation({
    summary: 'Exonérer / annuler une pénalité',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de la pénalité',
  })
  @ApiUpdated(
    PenaltyResponseDto,
    'Pénalité exonérée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Statut de la pénalité invalide.',
    notFound: 'Pénalité introuvable.',
  })
  waive(@Param('id', ParseUUIDPipe) id: string) {
    return this.penaltiesService.waive(id);
  }
}
