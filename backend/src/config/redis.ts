import { createClient } from 'redis';

let redisClient: any = null;
let redisEnabled = false;

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        reconnectStrategy: false, // Disable auto-reconnect
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err: any) => {
      // Silently handle errors when Redis is not available
      if (!redisEnabled) return;
      console.error('❌ Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
      redisEnabled = true;
    });

    await redisClient.connect();
    redisEnabled = true;
  } catch (error: any) {
    console.log('⚠️  Redis not available - Running without cache (this is fine)');
    redisEnabled = false;
    redisClient = null;
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return null;
    return await redisClient.get(key);
  } catch (error) {
    return null;
  }
};

export const setCache = async (
  key: string,
  value: string,
  ttl: number = 3600
): Promise<void> => {
  try {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return;
    await redisClient.setEx(key, ttl, value);
  } catch (error) {
    // Silently fail
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return;
    await redisClient.del(key);
  } catch (error) {
    // Silently fail
  }
};

export const clearCachePattern = async (pattern: string): Promise<void> => {
  try {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    // Silently fail
  }
};

export default redisClient;
