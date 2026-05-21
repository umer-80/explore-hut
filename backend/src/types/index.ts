import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// User Types
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Listing Types with Geo-spatial
export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
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
  location: string; // Address string (backward compatible)
  country: string;
  geoLocation?: ILocation; // Optional geo-spatial coordinates
  owner: string | IUser;
  reviews: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface IReview {
  _id: string;
  comment: string;
  rating: number;
  author: string | IUser;
  listing: string | IListing;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Types
export interface IJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface IRefreshTokenPayload extends JwtPayload {
  id: string;
  tokenVersion: number;
}

// Request Types
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination Types
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

// Search Types
export interface GeoSearchParams {
  longitude: number;
  latitude: number;
  maxDistance: number; // in meters
  minPrice?: number;
  maxPrice?: number;
}

// Cache Types
export interface CacheOptions {
  ttl?: number;
  key: string;
}
