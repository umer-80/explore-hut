"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenPair = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate Access Token (short-lived)
const generateAccessToken = (userId, email) => {
    const payload = {
        id: userId,
        email,
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    });
};
exports.generateAccessToken = generateAccessToken;
// Generate Refresh Token (long-lived)
const generateRefreshToken = (userId, tokenVersion = 0) => {
    const payload = {
        id: userId,
        tokenVersion,
    };
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
// Verify Access Token
const verifyAccessToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyAccessToken = verifyAccessToken;
// Verify Refresh Token
const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
// Generate Token Pair
const generateTokenPair = (userId, email, tokenVersion = 0) => {
    return {
        accessToken: (0, exports.generateAccessToken)(userId, email),
        refreshToken: (0, exports.generateRefreshToken)(userId, tokenVersion),
    };
};
exports.generateTokenPair = generateTokenPair;
//# sourceMappingURL=jwt.js.map