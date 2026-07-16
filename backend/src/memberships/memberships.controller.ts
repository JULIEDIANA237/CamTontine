import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { MembershipsService } from './memberships.service';

import { CreateMembershipDto } from './dto/requests/create-membership.dto';
import { QueryMembershipsDto } from './dto/requests/query-memberships.dto';
import { UpdateMembershipRoleDto } from './dto/requests/update-membership-role.dto';
import { UpdateMembershipStatusDto } from './dto/requests/update-membership-status.dto';

@ApiTags('Memberships')
@ApiBearerAuth()
@Controller('tontines/:tontineId/members')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
  ) { }

  @Post()
  create(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Body()
    dto: CreateMembershipDto,
  ) {
    return this.membershipsService.create(
      tontineId,
      dto,
    );
  }

  @Get()
  findAll(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Query()
    query: QueryMembershipsDto,
  ) {
    return this.membershipsService.findAll(
      tontineId,
      query,
    );
  }

  @Get(':membershipId')
  findOne(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,
  ) {
    return this.membershipsService.findOne(
      tontineId,
      membershipId,
    );
  }

  @Patch(':membershipId/role')
  updateRole(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,

    @Body()
    dto: UpdateMembershipRoleDto,
  ) {
    return this.membershipsService.updateRole(
      tontineId,
      membershipId,
      dto,
    );
  }

  @Patch(':membershipId/status')
  updateStatus(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,

    @Body()
    dto: UpdateMembershipStatusDto,
  ) {
    return this.membershipsService.updateStatus(
      tontineId,
      membershipId,
      dto,
    );
  }

  @Delete(':membershipId')
  remove(
    @Param(
      'tontineId',
      ParseUUIDPipe,
    )
    tontineId: string,

    @Param(
      'membershipId',
      ParseUUIDPipe,
    )
    membershipId: string,
  ) {
    return this.membershipsService.remove(
      tontineId,
      membershipId,
    );
  }
}