import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { AuthorizationContextBuilder } from './authorization-context.builder';

@Module({
    imports: [
        PrismaModule,
    ],

    providers: [
        AuthorizationContextBuilder,
    ],

    exports: [
        AuthorizationContextBuilder,
    ],
})
export class AuthorizationModule { }