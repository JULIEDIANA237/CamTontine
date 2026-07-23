import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { InvitationMapper } from './mappers/invitation.mapper';
import { InvitationLoader } from './loaders/invitation.loader';

@Module({
  controllers: [InvitationsController],
  providers: [InvitationsService, InvitationMapper, InvitationLoader],
  exports: [InvitationsService, InvitationMapper, InvitationLoader],
})
export class InvitationsModule {}
