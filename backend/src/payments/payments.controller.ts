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

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/requests/create-payment.dto';
import { FindPaymentsDto } from './dto/requests/find-payments.dto';
import { ProcessPaymentDto } from './dto/requests/process-payment.dto';
import { PaymentResponseDto } from './dto/responses/payment-response.dto';
import { PaymentListItemDto } from './dto/responses/payment-list-item.dto';

@ApiTags('Payments')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Initier un paiement pour une contribution',
  })
  @ApiCreated(
    PaymentResponseDto,
    'Paiement initié avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Contribution introuvable ou déjà payée.',
    conflict: 'Un paiement valide existe déjà.',
  })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les paiements',
  })
  @ApiPagination(
    PaymentListItemDto,
    'Liste paginée des paiements.',
  )
  findAll(@Query() query: FindPaymentsDto) {
    return this.paymentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Obtenir les détails d'un paiement",
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du paiement',
  })
  @ApiUpdated(
    PaymentResponseDto,
    'Paiement récupéré avec succès.',
  )
  @ApiStandardResponses({
    notFound: 'Paiement introuvable.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id/process')
  @ApiOperation({
    summary: 'Traiter ou valider le statut du paiement',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du paiement',
  })
  @ApiUpdated(
    PaymentResponseDto,
    'Paiement traité avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Statut de paiement invalide.',
    notFound: 'Paiement introuvable.',
  })
  process(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ProcessPaymentDto,
  ) {
    return this.paymentsService.process(id, dto);
  }

  @Patch(':id/refund')
  @ApiOperation({
    summary: 'Rembourser un paiement',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du paiement',
  })
  @ApiUpdated(
    PaymentResponseDto,
    'Paiement remboursé avec succès.',
  )
  @ApiStandardResponses({
    badRequest: 'Le paiement ne peut pas être remboursé.',
    notFound: 'Paiement introuvable.',
  })
  refund(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.refund(id);
  }
}
