"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.geoSearchSchema = exports.createReviewSchema = exports.updateListingSchema = exports.createListingSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
// User Schemas
exports.signupSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: zod_1.z
        .string()
        .email('Invalid email address')
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').toLowerCase(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Listing Schemas
exports.createListingSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must be less than 100 characters'),
    description: zod_1.z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description must be less than 2000 characters'),
    price: zod_1.z
        .string()
        .transform((val) => parseFloat(val))
        .pipe(zod_1.z.number().positive('Price must be positive').max(1000000, 'Price must be less than 1,000,000')),
    location: zod_1.z.string().min(2, 'Location is required'),
    country: zod_1.z.string().min(2, 'Country is required'),
    // Optional geo-spatial fields
    longitude: zod_1.z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .pipe(zod_1.z.number().min(-180).max(180).optional())
        .optional(),
    latitude: zod_1.z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .pipe(zod_1.z.number().min(-90).max(90).optional())
        .optional(),
});
exports.updateListingSchema = exports.createListingSchema.partial();
// Review Schemas
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
    comment: zod_1.z
        .string()
        .min(10, 'Comment must be at least 10 characters')
        .max(1000, 'Comment must be less than 1000 characters'),
});
// Geo-spatial Search Schema
exports.geoSearchSchema = zod_1.z.object({
    longitude: zod_1.z.number().min(-180).max(180),
    latitude: zod_1.z.number().min(-90).max(90),
    maxDistance: zod_1.z.number().positive().max(100000).default(10000), // 10km default
    minPrice: zod_1.z.number().positive().optional(),
    maxPrice: zod_1.z.number().positive().optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(20),
});
// Pagination Schema
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    sort: zod_1.z.enum(['price', '-price', 'createdAt', '-createdAt']).optional(),
});
//# sourceMappingURL=schemas.js.map