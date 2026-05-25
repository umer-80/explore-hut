"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCachePattern = exports.deleteCache = exports.setCache = exports.getCache = exports.connectRedis = void 0;
const redis_1 = require("redis");
let redisClient = null;
let redisEnabled = false;
const connectRedis = async () => {
    try {
        redisClient = (0, redis_1.createClient)({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                reconnectStrategy: false, // Disable auto-reconnect
            },
            password: process.env.REDIS_PASSWORD || undefined,
        });
        redisClient.on('error', (err) => {
            // Silently handle errors when Redis is not available
            if (!redisEnabled)
                return;
            console.error('❌ Redis Client Error:', err.message);
        });
        redisClient.on('connect', () => {
            console.log('✅ Redis connected successfully');
            redisEnabled = true;
        });
        await redisClient.connect();
        redisEnabled = true;
    }
    catch (error) {
        console.log('⚠️  Redis not available - Running without cache (this is fine)');
        redisEnabled = false;
        redisClient = null;
    }
};
exports.connectRedis = connectRedis;
const getCache = async (key) => {
    try {
        if (!redisEnabled || !redisClient || !redisClient.isOpen)
            return null;
        return await redisClient.get(key);
    }
    catch (error) {
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, value, ttl = 3600) => {
    try {
        if (!redisEnabled || !redisClient || !redisClient.isOpen)
            return;
        await redisClient.setEx(key, ttl, value);
    }
    catch (error) {
        // Silently fail
    }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        if (!redisEnabled || !redisClient || !redisClient.isOpen)
            return;
        await redisClient.del(key);
    }
    catch (error) {
        // Silently fail
    }
};
exports.deleteCache = deleteCache;
const clearCachePattern = async (pattern) => {
    try {
        if (!redisEnabled || !redisClient || !redisClient.isOpen)
            return;
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }
    catch (error) {
        // Silently fail
    }
};
exports.clearCachePattern = clearCachePattern;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map