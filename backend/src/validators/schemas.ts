import { z } from 'zod';

// User Schemas
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// Listing Schemas
export const createListingSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('Price must be positive').max(1000000, 'Price must be less than 1,000,000')),
  location: z.string().min(2, 'Location is required'),
  country: z.string().min(2, 'Country is required'),
  // Optional geo-spatial fields
  longitude: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(-180).max(180).optional())
    .optional(),
  latitude: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(-90).max(90).optional())
    .optional(),
});

export const updateListingSchema = createListingSchema.partial();

// Review Schemas
export const createReviewSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
});

// Geo-spatial Search Schema
export const geoSearchSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  maxDistance: z.number().positive().max(100000).default(10000), // 10km default
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sort: z.enum(['price', '-price', 'createdAt', '-createdAt']).optional(),
});

// Types from schemas
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type GeoSearchInput = z.infer<typeof geoSearchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
