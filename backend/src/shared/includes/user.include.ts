import { Prisma } from '@prisma/client';

export const USER_INCLUDE =
    Prisma.validator<Prisma.UserInclude>()({});