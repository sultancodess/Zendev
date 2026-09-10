import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { updateClinicSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /clinic
router.get('/', (_req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  res.json({ success: true, data: clinic });
});

// PATCH /clinic
router.patch('/', validateBody(updateClinicSchema), (req: AuthRequest, res: Response) => {
  const updated = db.updateClinic(req.body);
  db.createAuditLog({
    clinicId: updated.id,
    action: 'CLINIC_UPDATED',
    entityType: 'CLINIC',
    entityId: updated.id,
    details: req.body,
  });
  res.json({ success: true, data: updated });
});

// GET /clinic/hours
router.get('/hours', (_req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  res.json({ success: true, data: clinic.hours });
});

export default router;
