import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

import { StatisticsLoader } from './loaders/statistics.loader';
import { StatisticsMapper } from './mappers/statistics.mapper';

@Module({
    imports: [
        PrismaModule,
    ],

    controllers: [
        StatisticsController,
    ],

    providers: [
        StatisticsService,
        StatisticsLoader,
        StatisticsMapper,
    ],

    exports: [
        StatisticsService,
    ],
})
export class StatisticsModule { }