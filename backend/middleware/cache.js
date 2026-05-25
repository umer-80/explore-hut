"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const redis_1 = require("../config/redis");
const cacheMiddleware = (ttl = 3600) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }
        const key = `cache:${req.originalUrl}`;
        try {
            const cachedData = await (0, redis_1.getCache)(key);
            if (cachedData) {
                console.log(`✅ Cache HIT: ${key}`);
                res.json(JSON.parse(cachedData));
                return;
            }
            console.log(`❌ Cache MISS: ${key}`);
            // Store original json method
            const originalJson = res.json.bind(res);
            // Override json method to cache response
            res.json = function (body) {
                // Cache the response
                (0, redis_1.setCache)(key, JSON.stringify(body), ttl).catch((err) => console.error('Cache set error:', err));
                // Call original json method
                return originalJson(body);
            };
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
//# sourceMappingURL=cache.js.map