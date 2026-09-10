import { Request, Response, NextFunction } from 'express';

export const requestIdMiddleware = (req: Request & { requestId?: string }, res: Response, next: NextFunction): void => {
  const incomingId = req.headers['x-request-id'] as string;
  const requestId = incomingId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
