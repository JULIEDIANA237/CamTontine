import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { MembershipMapper } from './mappers/membership.mapper';
import { MembershipAbilityService } from './membership-ability.service';
import { MembershipPolicyService } from './policies/membership-policy.service';



@Module({
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    MembershipMapper,
    MembershipAbilityService,
    MembershipPolicyService,
  ],
})
export class MembershipsModule { }
