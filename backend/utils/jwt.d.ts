import { IJwtPayload, IRefreshTokenPayload } from '../types';
export declare const generateAccessToken: (userId: string, email: string) => string;
export declare const generateRefreshToken: (userId: string, tokenVersion?: number) => string;
export declare const verifyAccessToken: (token: string) => IJwtPayload;
export declare const verifyRefreshToken: (token: string) => IRefreshTokenPayload;
export declare const generateTokenPair: (userId: string, email: string, tokenVersion?: number) => {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=jwt.d.ts.map