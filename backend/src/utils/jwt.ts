import jwt from 'jsonwebtoken';
import { IJwtPayload, IRefreshTokenPayload } from '../types';

// Generate Access Token (short-lived)
export const generateAccessToken = (userId: string, email: string): string => {
  const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
    id: userId,
    email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
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

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

// Verify Access Token
export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as IJwtPayload;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): IRefreshTokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as IRefreshTokenPayload;
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
