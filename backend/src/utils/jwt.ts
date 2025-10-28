import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';
import { prisma } from '@/config/database.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}

export class JWTService {
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'rapchai-api',
      audience: 'rapchai-client',
    });
  }

  static generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'rapchai-api',
      audience: 'rapchai-client',
    });
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: 'rapchai-api',
        audience: 'rapchai-client',
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: 'rapchai-api',
        audience: 'rapchai-client',
      }) as RefreshTokenPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async createRefreshToken(userId: string): Promise<string> {
    // Revoke existing refresh tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    // Create new refresh token
    const token = this.generateRefreshToken({ userId, tokenId: '' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const refreshTokenRecord = await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    // Update token with the actual ID
    const updatedToken = this.generateRefreshToken({ 
      userId, 
      tokenId: refreshTokenRecord.id 
    });

    await prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { token: updatedToken },
    });

    return updatedToken;
  }

  static async revokeRefreshToken(tokenId: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id: tokenId },
      data: { isRevoked: true },
    });
  }

  static async validateRefreshToken(token: string): Promise<{ userId: string; tokenId: string }> {
    const payload = this.verifyRefreshToken(token);
    
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
    });

    if (!refreshTokenRecord || refreshTokenRecord.isRevoked || refreshTokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    return { userId: payload.userId, tokenId: payload.tokenId };
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  static getTokenExpiration(token: string): Date | null {
    const decoded = this.decodeToken(token);
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  }
}
