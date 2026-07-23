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

import { PayoutsService } from './payouts.service';
import { CreatePayoutDto } from './dto/requests/create-payout.dto';
import { FindPayoutsDto } from './dto/requests/find-payouts.dto';
import { GeneratePayoutOrdersDto } from './dto/requests/generate-payout-orders.dto';
import { SwapPayoutOrdersDto } from './dto/requests/swap-payout-orders.dto';
import { PayoutResponseDto } from './dto/responses/payout-response.dto';
import { PayoutListItemDto } from './dto/responses/payout-list-item.dto';
import { PayoutOrderResponseDto } from './dto/responses/payout-order-response.dto';

@ApiTags('Payouts & Turn Orders')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  // ─── Payout Endpoints ───────────────────────────────────────────────────

  @Post('payouts')
  @ApiOperation({
    summary: 'Créer une distribution (payout) pour un cycle',
  })
  @ApiCreated(
    PayoutResponseDto,
    'Distribution créée avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Cycle ou bénéficiaire invalide.',
    conflict: 'Une distribution existe déjà pour ce cycle.',
  })
  create(@Body() dto: CreatePayoutDto) {
    return this.payoutsService.create(dto);
  }

  @Get('payouts')
  @ApiOperation({
    summary: 'Lister les distributions (payouts)',
  })
  @ApiPagination(
    PayoutListItemDto,
    'Liste paginée des distributions.',
  )
  findAll(@Query() query: FindPayoutsDto) {
    return this.payoutsService.findAll(query);
  }

  @Get('payouts/:id')
  @ApiOperation({
    summary: "Obtenir les détails d'une distribution",
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du payout',
  })
  @ApiUpdated(
    PayoutResponseDto,
    'Distribution récupérée avec succès.',
  )
  @ApiStandardResponses({
    notFound: 'Distribution introuvable.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.payoutsService.findOne(id);
  }

  @Patch('payouts/:id/process')
  @ApiOperation({
    summary: 'Valider/Marquer comme payée une distribution',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du payout',
  })
  @ApiUpdated(
    PayoutResponseDto,
    'Distribution marquée comme payée.',
  )
  @ApiStandardResponses({
    badRequest: 'Statut du payout invalide.',
    notFound: 'Distribution introuvable.',
  })
  process(@Param('id', ParseUUIDPipe) id: string) {
    return this.payoutsService.process(id);
  }

  @Patch('payouts/:id/cancel')
  @ApiOperation({
    summary: 'Annuler une distribution',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du payout',
  })
  @ApiUpdated(
    PayoutResponseDto,
    'Distribution annulée.',
  )
  @ApiStandardResponses({
    badRequest: 'Le payout ne peut pas être annulé.',
    notFound: 'Distribution introuvable.',
  })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.payoutsService.cancel(id);
  }

  // ─── Payout Orders (Ordre de passage) ───────────────────────────────────

  @Post('tontines/:tontineId/payout-orders/generate')
  @ApiOperation({
    summary: 'Générer/Tirer au sort l’ordre de passage pour une tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiCreated(
    [PayoutOrderResponseDto],
    'Ordre de passage généré avec succès.',
  )
  generateOrders(
    @Param('tontineId', ParseUUIDPipe) tontineId: string,
    @Body() dto?: GeneratePayoutOrdersDto,
  ) {
    return this.payoutsService.generateOrders(tontineId, dto);
  }

  @Get('tontines/:tontineId/payout-orders')
  @ApiOperation({
    summary: 'Obtenir l’ordre de passage pour une tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  getOrders(@Param('tontineId', ParseUUIDPipe) tontineId: string) {
    return this.payoutsService.getOrders(tontineId);
  }

  @Patch('tontines/:tontineId/payout-orders/swap')
  @ApiOperation({
    summary: 'Échanger le tour de passage entre deux membres',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  swapOrders(
    @Param('tontineId', ParseUUIDPipe) tontineId: string,
    @Body() dto: SwapPayoutOrdersDto,
  ) {
    return this.payoutsService.swapOrders(tontineId, dto);
  }
}
