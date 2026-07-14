import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { CreateTontineDto } from './dto/create-tontine.dto';

import { TontinesService } from './tontines.service';
import { QueryTontinesDto } from './dto/query-tontines.dto';
import { UpdateTontineDto } from './dto/update-tontine.dto';
import { UpdateTontineStatusDto } from './dto/update-tontine-status.dto';

@ApiTags('Tontines')
@ApiBearerAuth('access-token')
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
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTontineDto,
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
  findAll(
    @Query() query: QueryTontinesDto,
  ) {
    return this.tontinesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une tontine',
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.tontinesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Mettre à jour une tontine',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTontineDto,
  ) {
    return this.tontinesService.update(
      id,
      dto,
    );
  }

  @Post(':id/open-recruitment')
  @ApiOperation({
    summary: 'Ouvrir le recrutement d’une tontine',
  })
  openRecruitment(
    @Param('id') id: string,
  ) {
    return this.tontinesService.openRecruitment(id);
  }

  @Post(':id/start')
  @ApiOperation({
    summary: 'Démarrer une tontine',
  })
  start(
    @Param('id') id: string,
  ) {
    return this.tontinesService.start(id);
  }

  @Post(':id/suspend')
  @ApiOperation({
    summary: 'Suspendre une tontine',
  })
  suspend(
    @Param('id') id: string,
  ) {
    return this.tontinesService.suspend(id);
  }

  @Post(':id/resume')
  @ApiOperation({
    summary: 'Reprendre une tontine',
  })
  resume(
    @Param('id') id: string,
  ) {
    return this.tontinesService.resume(id);
  }

  @Post(':id/complete')
  @ApiOperation({
    summary: 'Terminer une tontine',
  })
  complete(
    @Param('id') id: string,
  ) {
    return this.tontinesService.complete(id);
  }

  @Post(':id/archive')
  @ApiOperation({
    summary: 'Archiver une tontine',
  })
  archive(
    @Param('id') id: string,
  ) {
    return this.tontinesService.archive(id);
  }

}