import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { createServiceSchema, updateServiceSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /services
router.get('/', (_req: AuthRequest, res: Response) => {
  const services = db.getServices();
  res.json({ success: true, data: services });
});

// POST /services
router.post('/', validateBody(createServiceSchema), (req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  const service = db.createService({
    ...req.body,
    clinicId: clinic.id,
  });
  db.createAuditLog({
    clinicId: clinic.id,
    action: 'SERVICE_CREATED',
    entityType: 'SERVICE',
    entityId: service.id,
    details: { name: service.name, price: service.price },
  });
  res.status(201).json({ success: true, data: service });
});

// GET /services/:id
router.get('/:id', (req: AuthRequest, res: Response) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } });
    return;
  }
  res.json({ success: true, data: service });
});

// PATCH /services/:id
router.patch('/:id', validateBody(updateServiceSchema), (req: AuthRequest, res: Response) => {
  const service = db.updateService(req.params.id, req.body);
  if (!service) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } });
    return;
  }
  res.json({ success: true, data: service });
});

export default router;
