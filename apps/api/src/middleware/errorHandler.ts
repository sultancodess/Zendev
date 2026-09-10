import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction
): void => {
  const requestId = req.requestId || `req_${Date.now()}`;
  console.error(`[Error] [${requestId}] ${req.method} ${req.originalUrl}:`, err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: formattedIssues,
        requestId,
      },
    });
    return;
  }

  // Handle AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        requestId,
      },
    });
    return;
  }

  // Generic internal server error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred on the server.',
      requestId,
    },
  });
};
