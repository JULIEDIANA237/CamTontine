import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Query,
  Param,
  Delete,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import { ParseUUIDPipe } from '@nestjs/common';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiOperation({
    summary: 'Récupérer le profil utilisateur connecté',
  })
  @Get('me')
  getCurrentUser(
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.getCurrentUser(user.sub);
  }

  @ApiOperation({
    summary: 'Mettre à jour son profil',
  })
  @Patch('me')
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      user.sub,
      dto,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Lister les utilisateurs',
  })
  findAll(@Query() query: QueryUsersDto) {
    console.log('Controller Users.findAll');
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir un utilisateur par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant UUID de l'utilisateur",
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: "Mettre à jour un utilisateur",
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({
    summary: "Modifier le statut d'un utilisateur",
  })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto);
  }

  @ApiOperation({
    summary: "Modifier le rôle d'un utilisateur",
  })
  @Patch(':id/role')
  updateRole(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(user.sub, id, dto);
  }

  @ApiOperation({
    summary: 'Supprimer un utilisateur (suppression logique)',
  })
  @Delete(':id')
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.delete(
      user.sub,
      id,
    );
  }
}