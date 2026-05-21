import jwt from 'jsonwebtoken';
import { IJwtPayload, IRefreshTokenPayload } from '../types';

// Generate Access Token (short-lived)
export const generateAccessToken = (userId: string, email: string): string => {
  const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
    id: userId,
    email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  } as any);
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (
  userId: string,
  tokenVersion: number = 0
): string => {
  const payload: Omit<IRefreshTokenPayload, 'iat' | 'exp'> = {
    id: userId,
    tokenVersion,
  };

  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  } as any);
};

// Verify Access Token
export const verifyAccessToken = (token: string): IJwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, secret) as IJwtPayload;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): IRefreshTokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  return jwt.verify(token, secret) as IRefreshTokenPayload;
};

// Generate Token Pair
export const generateTokenPair = (
  userId: string,
  email: string,
  tokenVersion: number = 0
) => {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, tokenVersion),
  };
};
