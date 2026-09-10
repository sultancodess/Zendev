import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '@dermo/types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    clinicId: string;
    email: string;
    role: UserRole;
  };
  requestId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In local dev mode, allow simulated staff access if no token is provided
    if (config.nodeEnv === 'development') {
      req.user = {
        id: 'user_dev_01',
        clinicId: 'clinic_dermacare_01',
        email: 'doctor@dermacareclinic.in',
        role: 'OWNER',
      };
      return next();
    }
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token is required.',
        requestId: req.requestId,
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'The provided authentication token is invalid or expired.',
        requestId: req.requestId,
      },
    });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
          requestId: req.requestId,
        },
      });
      return;
    }
    next();
  };
};
