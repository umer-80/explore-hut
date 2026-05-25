import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface ILocation {
    type: 'Point';
    coordinates: [number, number];
}
export interface IListing {
    _id: string;
    title: string;
    description: string;
    image: {
        url: string;
        filename: string;
    };
    price: number;
    location: string;
    country: string;
    geoLocation?: ILocation;
    owner: string | IUser;
    reviews: string[];
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IReview {
    _id: string;
    comment: string;
    rating: number;
    author: string | IUser;
    listing: string | IListing;
    createdAt: Date;
    updatedAt: Date;
}
export interface IJwtPayload extends JwtPayload {
    id: string;
    email: string;
}
export interface IRefreshTokenPayload extends JwtPayload {
    id: string;
    tokenVersion: number;
}
export interface AuthRequest extends Request {
    user?: IUser;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface GeoSearchParams {
    longitude: number;
    latitude: number;
    maxDistance: number;
    minPrice?: number;
    maxPrice?: number;
}
export interface CacheOptions {
    ttl?: number;
    key: string;
}
//# sourceMappingURL=index.d.ts.map