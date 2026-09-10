import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request & { requestId?: string }, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: errorMessages,
            requestId: req.requestId,
          },
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request & { requestId?: string }, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: errorMessages,
            requestId: req.requestId,
          },
        });
        return;
      }
      next(error);
    }
  };
};
