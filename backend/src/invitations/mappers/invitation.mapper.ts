import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../common/mappers';
import { InvitationResponseDto } from '../dto/responses/invitation-response.dto';
import { InvitationListItemDto } from '../dto/responses/invitation-list-item.dto';
import { InvitationWithRelations } from '../invitation.prisma';

@Injectable()
export class InvitationMapper extends BaseMapper<
    InvitationWithRelations,
    InvitationResponseDto,
    InvitationListItemDto
> {
    override toResponse(invitation: InvitationWithRelations): InvitationResponseDto {
        return {
            id: invitation.id,
            email: invitation.email,
            phone: invitation.phone,
            token: invitation.token,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            acceptedAt: invitation.acceptedAt,
            createdAt: invitation.createdAt,
            tontine: {
                id: invitation.tontine.id,
                name: invitation.tontine.name,
            },
            invitedBy: {
                id: invitation.invitedBy.id,
                firstName: invitation.invitedBy.firstName,
                lastName: invitation.invitedBy.lastName,
                email: invitation.invitedBy.email,
            },
        };
    }

    override toListItem(invitation: InvitationWithRelations): InvitationListItemDto {
        return {
            id: invitation.id,
            email: invitation.email,
            phone: invitation.phone,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            createdAt: invitation.createdAt,
        };
    }
}
