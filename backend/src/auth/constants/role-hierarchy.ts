import { UserRole } from '@prisma/client';

export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
    [UserRole.SUPER_ADMIN]: [
        UserRole.SUPER_ADMIN,
        UserRole.USER,
    ],

    [UserRole.USER]: [
        UserRole.USER,
    ],
};