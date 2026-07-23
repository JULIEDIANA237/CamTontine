import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
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

import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/requests/create-invitation.dto';
import { FindInvitationsDto } from './dto/requests/find-invitations.dto';
import { InvitationResponseDto } from './dto/responses/invitation-response.dto';
import { InvitationListItemDto } from './dto/responses/invitation-list-item.dto';

@ApiTags('Invitations')
@Controller()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('tontines/:tontineId/invitations')
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Envoyer une invitation à rejoindre une tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiCreated(
    InvitationResponseDto,
    'Invitation créée avec succès.',
  )
  create(
    @Param('tontineId', ParseUUIDPipe) tontineId: string,
    @Request() req: any,
    @Body() dto: CreateInvitationDto,
  ) {
    const userId = req.user.id;
    return this.invitationsService.create(tontineId, userId, dto);
  }

  @Get('tontines/:tontineId/invitations')
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lister les invitations d’une tontine',
  })
  @ApiParam({
    name: 'tontineId',
    description: 'Identifiant UUID de la tontine',
  })
  @ApiPagination(
    InvitationListItemDto,
    'Liste paginée des invitations.',
  )
  findAllForTontine(
    @Param('tontineId', ParseUUIDPipe) tontineId: string,
    @Query() query: FindInvitationsDto,
  ) {
    return this.invitationsService.findAllForTontine(tontineId, query);
  }

  @Get('invitations/token/:token')
  @ApiOperation({
    summary: 'Obtenir les détails d’une invitation publique par son jeton (token)',
  })
  @ApiParam({
    name: 'token',
    description: 'Jeton unique de l’invitation',
  })
  findByToken(@Param('token') token: string) {
    return this.invitationsService.findByToken(token);
  }

  @Post('invitations/token/:token/accept')
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Accepter une invitation et rejoindre la tontine',
  })
  @ApiParam({
    name: 'token',
    description: 'Jeton unique de l’invitation',
  })
  accept(
    @Param('token') token: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.invitationsService.accept(token, userId);
  }

  @Post('invitations/token/:token/decline')
  @ApiOperation({
    summary: 'Refuser une invitation',
  })
  @ApiParam({
    name: 'token',
    description: 'Jeton unique de l’invitation',
  })
  decline(@Param('token') token: string) {
    return this.invitationsService.decline(token);
  }
}
