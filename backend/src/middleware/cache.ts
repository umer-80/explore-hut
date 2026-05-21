import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../config/redis';

export const cacheMiddleware = (ttl: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await getCache(key);

      if (cachedData) {
        console.log(`✅ Cache HIT: ${key}`);
        res.json(JSON.parse(cachedData));
        return;
      }

      console.log(`❌ Cache MISS: ${key}`);

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = function (body: any): Response {
        // Cache the response
        setCache(key, JSON.stringify(body), ttl).catch((err) =>
          console.error('Cache set error:', err)
        );

        // Call original json method
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};
