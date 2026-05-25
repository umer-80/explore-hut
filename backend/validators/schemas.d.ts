import { z } from 'zod';
export declare const signupSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
}, {
    email: string;
    username: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createListingSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
    location: z.ZodString;
    country: z.ZodString;
    longitude: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number | undefined, string>, z.ZodOptional<z.ZodNumber>>>;
    latitude: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number | undefined, string>, z.ZodOptional<z.ZodNumber>>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    price: number;
    location: string;
    country: string;
    longitude?: number | undefined;
    latitude?: number | undefined;
}, {
    description: string;
    title: string;
    price: string;
    location: string;
    country: string;
    longitude?: string | undefined;
    latitude?: string | undefined;
}>;
export declare const updateListingSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    location: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number | undefined, string>, z.ZodOptional<z.ZodNumber>>>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number | undefined, string>, z.ZodOptional<z.ZodNumber>>>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    title?: string | undefined;
    price?: number | undefined;
    location?: string | undefined;
    country?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
}, {
    description?: string | undefined;
    title?: string | undefined;
    price?: string | undefined;
    location?: string | undefined;
    country?: string | undefined;
    longitude?: string | undefined;
    latitude?: string | undefined;
}>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    comment: string;
    rating: number;
}, {
    comment: string;
    rating: number;
}>;
export declare const geoSearchSchema: z.ZodObject<{
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
    maxDistance: z.ZodDefault<z.ZodNumber>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    longitude: number;
    latitude: number;
    maxDistance: number;
    page: number;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    longitude: number;
    latitude: number;
    limit?: number | undefined;
    maxDistance?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    page?: number | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<["price", "-price", "createdAt", "-createdAt"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort?: "createdAt" | "price" | "-price" | "-createdAt" | undefined;
}, {
    sort?: "createdAt" | "price" | "-price" | "-createdAt" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type GeoSearchInput = z.infer<typeof geoSearchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
//# sourceMappingURL=schemas.d.ts.map