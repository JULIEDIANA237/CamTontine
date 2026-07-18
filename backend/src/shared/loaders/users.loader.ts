import { Injectable } from '@nestjs/common';

import { UserStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { UserNotFoundException } from '../../common/exceptions';

@Injectable()
export class UsersLoader {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async byId(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async byEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async byPhone(phone: string) {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }

    async activeById(id: string) {
        const user = await this.byId(id);

        if (user.status === UserStatus.DELETED) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { id },
        });

        return count > 0;
    }
}