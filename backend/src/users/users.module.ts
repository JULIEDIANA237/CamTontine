import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { PrismaModule } from '../prisma/prisma.module';
import { UserMapper } from './mappers/user.mapper';
import { SharedModule } from '../shared/shared.module';
import { UsersLoader } from '../shared/loaders/users.loader';

@Module({
  imports: [PrismaModule, SharedModule],

  controllers: [UsersController],

  providers: [UsersService, UserMapper, UsersLoader],

  exports: [UsersService],
})
export class UsersModule { }