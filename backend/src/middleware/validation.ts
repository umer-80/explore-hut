import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse and validate request body
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Convert query params to appropriate types
      const query: Record<string, any> = { ...req.query };
      
      // Convert numeric strings to numbers
      Object.keys(query).forEach((key) => {
        const value = query[key];
        if (typeof value === 'string' && !isNaN(Number(value))) {
          query[key] = Number(value);
        }
      });

      const validated = await schema.parseAsync(query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};
