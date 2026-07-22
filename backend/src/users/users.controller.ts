import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { UserRole } from '@prisma/client';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import {
  ApiAuth,
  ApiPagination,
  ApiStandardResponses,
  ApiUpdated,
} from '../common/swagger';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

import { UserResponseDto } from './dto/responses/user-response.dto';
import { UserListItemDto } from './dto/responses/user-list-item.dto';

@ApiTags('Users')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get('me')
  @ApiOperation({
    summary:
      "Obtenir le profil de l'utilisateur connecté",
  })
  @ApiUpdated(
    UserResponseDto,
    'Profil récupéré avec succès.',
  )
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
  })
  getCurrentUser(
    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.usersService.getCurrentUser(
      user.sub,
    );
  }

  @Patch('me')
  @ApiOperation({
    summary:
      'Mettre à jour son profil',
  })
  @ApiUpdated(
    UserResponseDto,
    'Profil mis à jour avec succès.',
  )
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
  })
  updateProfile(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      user.sub,
      dto,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      'Lister tous les utilisateurs',
  })
  @ApiPagination(
    UserListItemDto,
    'Liste paginée des utilisateurs.',
  )
  @ApiStandardResponses()
  findAll(
    @Query()
    query: QueryUsersDto,
  ) {
    return this.usersService.findAll(
      query,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Obtenir un utilisateur',
  })
  @ApiParam({
    name: 'id',
    description:
      "UUID de l'utilisateur",
  })
  @ApiUpdated(
    UserResponseDto,
    'Utilisateur trouvé.',
  )
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
  })
  findOne(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.usersService.findOne(
      id,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Mettre à jour un utilisateur',
  })
  @ApiParam({
    name: 'id',
    description:
      "UUID de l'utilisateur",
  })
  @ApiUpdated(
    UserResponseDto,
    'Utilisateur mis à jour.',
  )
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
  })
  update(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

    @Body()
    dto: UpdateUserDto,
  ) {
    return this.usersService.update(
      id,
      dto,
    );
  }

  @Patch(':id/status')
  @ApiOperation({
    summary:
      "Modifier le statut d'un utilisateur",
  })
  @ApiParam({
    name: 'id',
    description:
      "UUID de l'utilisateur",
  })
  @ApiUpdated(
    UserResponseDto,
    'Statut mis à jour.',
  )
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
  })
  updateStatus(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

    @Body()
    dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(
      id,
      dto,
    );
  }

  @Patch(':id/role')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      "Modifier le rôle d'un utilisateur",
  })
  @ApiParam({
    name: 'id',
    description:
      "UUID de l'utilisateur",
  })
  @ApiUpdated(
    UserResponseDto,
    'Rôle mis à jour.',
  )
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
    conflict:
      'Modification impossible.',
  })
  updateRole(
    @CurrentUser()
    user: JwtPayload,

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

    @Body()
    dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(
      user.sub,
      id,
      dto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      'Supprimer un utilisateur (suppression logique)',
  })
  @ApiStandardResponses({
    notFound:
      'Utilisateur introuvable.',
  })
  remove(
    @CurrentUser()
    user: JwtPayload,

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.usersService.delete(
      user.sub,
      id,
    );
  }
}