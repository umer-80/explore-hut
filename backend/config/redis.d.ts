declare let redisClient: any;
export declare const connectRedis: () => Promise<void>;
export declare const getCache: (key: string) => Promise<string | null>;
export declare const setCache: (key: string, value: string, ttl?: number) => Promise<void>;
export declare const deleteCache: (key: string) => Promise<void>;
export declare const clearCachePattern: (pattern: string) => Promise<void>;
export default redisClient;
//# sourceMappingURL=redis.d.ts.map