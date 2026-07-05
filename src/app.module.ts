import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RolesModule } from './roles/roles.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ContributionCyclesModule } from './contribution-cycles/contribution-cycles.module';
import { ContributionsModule } from './contributions/contributions.module';
import { PayoutsModule } from './payouts/payouts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [AuthModule, UsersModule, GroupsModule, MembershipsModule, RolesModule, InvitationsModule, ContributionCyclesModule, ContributionsModule, PayoutsModule, NotificationsModule, ReportsModule, DashboardModule, AuditLogsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
