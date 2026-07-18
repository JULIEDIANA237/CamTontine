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

import { UserMapper } from '../users/mappers/user.mapper';

import { ApiResponse } from '../common/responses';

import { AuthMessages, UserMessages } from '../common/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,

    private readonly userMapper: UserMapper,
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
      if (existingUser.email === dto.email) {
        throw new ConflictException(
          UserMessages.EMAIL_ALREADY_USED,
        );
      }
      throw new ConflictException(
        UserMessages.PHONE_ALREADY_USED,
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
    return ApiResponse.created(
      {
        user: this.userMapper.toResponse(user),
        accessToken,
        refreshToken,
      },
      AuthMessages.REGISTER_SUCCESS,
    );
  }

  async login(dto: { email: string; password: string }) {
    // 1. Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        AuthMessages.INVALID_CREDENTIALS,
      );
    }

    // 2. Vérifier statut
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        AuthMessages.ACCOUNT_DISABLED,
      );
    }

    // 3. Vérifier mot de passe
    const isPasswordValid = await this.comparePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        AuthMessages.INVALID_CREDENTIALS,
      );
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
    return ApiResponse.success(
      {
        user: this.userMapper.toResponse(user),
        accessToken,
        refreshToken,
      },
      AuthMessages.LOGIN_SUCCESS,
    );
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
        throw new UnauthorizedException(
          UserMessages.NOT_FOUND,
        );
      }

      // 3. Récupérer refresh tokens stockés
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId,
          revokedAt: null,
        },
      });

      if (!storedTokens.length) {
        throw new UnauthorizedException(
          AuthMessages.INVALID_REFRESH_TOKEN,
        );
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
        throw new UnauthorizedException(
          AuthMessages.INVALID_REFRESH_TOKEN,
        );
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
      return ApiResponse.success(
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        AuthMessages.REFRESH_SUCCESS,
      );
    } catch (error) {
      throw new UnauthorizedException(
        AuthMessages.INVALID_REFRESH_TOKEN,
      );
    }
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    return ApiResponse.success(
      null,
      AuthMessages.LOGOUT_SUCCESS,
    );
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(
        UserMessages.NOT_FOUND,
      );
    }

    return ApiResponse.success(
      this.userMapper.toResponse(user),
      UserMessages.FOUND,
    );
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
      throw new UnauthorizedException(
        UserMessages.NOT_FOUND,
      );
    }

    // 2. Vérifier ancien mot de passe
    const isPasswordValid = await this.comparePassword(
      dto.oldPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        AuthMessages.INVALID_CREDENTIALS,
      );
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

    return ApiResponse.updated(
      null,
      UserMessages.UPDATED,
    );
  }
}