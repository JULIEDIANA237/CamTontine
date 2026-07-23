import { ApiProperty } from '@nestjs/swagger';
import { BeneficiaryTurnStatus } from '@prisma/client';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class PayoutOrderMemberSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: () => BasicUserDto })
    user: BasicUserDto;
}

export class PayoutOrderResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    tontineId: string;

    @ApiProperty()
    membershipId: string;

    @ApiProperty()
    sequence: number;

    @ApiProperty({ enum: BeneficiaryTurnStatus })
    status: BeneficiaryTurnStatus;

    @ApiProperty({ nullable: true })
    exchangedWithOrderId: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: () => PayoutOrderMemberSummaryDto })
    membership: PayoutOrderMemberSummaryDto;
}
