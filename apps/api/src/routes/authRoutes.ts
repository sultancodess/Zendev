import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { validateBody } from '../middleware/validator';
import { loginSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// POST /auth/login
router.post('/login', validateBody(loginSchema), (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Simple authentication logic for clinic staff/owner
  const token = jwt.sign(
    {
      id: 'usr_staff_01',
      clinicId: 'clinic_dermacare_01',
      email,
      name: 'Dr. Priya Sharma',
      role: 'OWNER',
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: 'usr_staff_01',
        clinicId: 'clinic_dermacare_01',
        email,
        name: 'Dr. Priya Sharma',
        role: 'OWNER',
      },
    },
  });
});

// GET /auth/me
router.get('/me', (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      id: 'usr_staff_01',
      clinicId: 'clinic_dermacare_01',
      email: 'doctor@dermacareclinic.in',
      name: 'Dr. Priya Sharma',
      role: 'OWNER',
    },
  });
});

// POST /auth/logout
router.post('/logout', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

export default router;
