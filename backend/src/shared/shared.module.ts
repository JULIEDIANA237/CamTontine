import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import {
    UsersLoader,
    TontinesLoader,
    MembershipsLoader,
} from './loaders';

@Module({
    imports: [PrismaModule],

    providers: [
        UsersLoader,
        TontinesLoader,
        MembershipsLoader,
    ],

    exports: [
        UsersLoader,
        TontinesLoader,
        MembershipsLoader,
    ],
})
export class SharedModule { }