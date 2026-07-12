import { UserRole, Locale } from '@prisma/client';
import { prisma } from '../src/prisma/prisma-client';
import * as bcrypt from 'bcrypt';

async function main() {
    console.log('🌱 Début du seeding...');

    const passwordHash = await bcrypt.hash('Password@123', 12);

    const users = [
        {
            email: 'admin@camtontine.com',
            phone: '+237670000001',
            firstName: 'Super',
            lastName: 'Admin',
            role: UserRole.SUPER_ADMIN,
        },
        {
            email: 'user1@camtontine.com',
            phone: '+237670000002',
            firstName: 'Julie',
            lastName: 'Ngono',
            role: UserRole.USER,
        },
        {
            email: 'user2@camtontine.com',
            phone: '+237670000003',
            firstName: 'Jean',
            lastName: 'Mballa',
            role: UserRole.USER,
        },
    ];

    for (const user of users) {
        const exists = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (!exists) {
            await prisma.user.create({
                data: {
                    email: user.email,
                    phone: user.phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    passwordHash,
                    locale: Locale.FR,
                    role: user.role,
                    emailVerified: true,
                },
            });

            console.log(`✅ ${user.email} créé`);
        } else {
            console.log(`ℹ️ ${user.email} existe déjà`);
        }
    }

    console.log('🎉 Seed terminé');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });