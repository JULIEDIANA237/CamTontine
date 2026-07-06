import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';

import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) { }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user.id,

        email: user.email,

        role: user.role,
      },
      {
        secret: this.configService.getOrThrow('jwt.accessSecret'),

        expiresIn: this.configService.getOrThrow(
          'jwt.accessExpiresIn',
        ) as any,
      },
    );
  }

  private async generateRefreshToken(
    user: User,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.getOrThrow(
          'jwt.refreshSecret',
        ),

        expiresIn: this.configService.getOrThrow(
          'jwt.refreshExpiresIn',
        ) as any,
      },
    );
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 12);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,

        tokenHash: hashedToken,

        expiresAt,
      },
    });
  }

  private async revokeAllRefreshTokens(
    userId: string,
  ): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async register(dto: RegisterDto) {
    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: dto.phone },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User already exists with this email or phone',
      );
    }

    // 2. Hash du mot de passe
    const passwordHash = await this.hashPassword(dto.password);

    // 3. Création de l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        locale: dto.locale ?? 'FR',
        passwordHash,
      },
    });

    // 4. Génération des tokens
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // 5. Sauvegarde du refresh token (hashé)
    await this.saveRefreshToken(user.id, refreshToken);

    // 6. Retour propre API
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          locale: user.locale,
          createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  async login(dto: { email: string; password: string }) {
    // 1. Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Vérifier statut
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    // 3. Vérifier mot de passe
    const isPasswordValid = await this.comparePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Générer tokens
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // 5. Révoquer anciens refresh tokens (rotation sécurité)
    await this.revokeAllRefreshTokens(user.id);

    // 6. Sauvegarder nouveau refresh token (hashé)
    await this.saveRefreshToken(user.id, refreshToken);

    // 7. Mettre à jour lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    // 8. Réponse API
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          locale: user.locale,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      // 1. Vérifier le refresh token JWT
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.getOrThrow('jwt.refreshSecret'),
        },
      );

      const userId = payload.sub;

      // 2. Récupérer utilisateur
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 3. Récupérer refresh tokens stockés
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId,
          revokedAt: null,
        },
      });

      if (!storedTokens.length) {
        throw new UnauthorizedException('No valid refresh tokens');
      }

      // 4. Vérifier correspondance avec hash
      let isValid = false;

      for (const stored of storedTokens) {
        const match = await bcrypt.compare(
          refreshToken,
          stored.tokenHash,
        );

        if (match) {
          isValid = true;

          // 5. Révoquer ancien token
          await this.prisma.refreshToken.update({
            where: { id: stored.id },
            data: {
              revokedAt: new Date(),
            },
          });

          break;
        }
      }

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 6. Générer nouveaux tokens
      const newAccessToken =
        await this.generateAccessToken(user);

      const newRefreshToken =
        await this.generateRefreshToken(user);

      // 7. Sauvegarder nouveau refresh token
      await this.saveRefreshToken(
        user.id,
        newRefreshToken,
      );

      // 8. Retour
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    return {
      success: true,
      message: 'Session fully cleared',
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        locale: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      message: 'User profile fetched successfully',
      data: user,
    };
  }

  async changePassword(
    userId: string,
    dto: { oldPassword: string; newPassword: string },
  ) {
    // 1. Récupérer utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 2. Vérifier ancien mot de passe
    const isPasswordValid = await this.comparePassword(
      dto.oldPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // 3. Hash nouveau mot de passe
    const newPasswordHash = await this.hashPassword(
      dto.newPassword,
    );

    // 4. Mise à jour utilisateur
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // 5. Révoquer tous les refresh tokens (sécurité)
    await this.revokeAllRefreshTokens(userId);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

}