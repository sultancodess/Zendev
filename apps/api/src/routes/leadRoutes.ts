import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { createLeadSchema, updateLeadSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /leads
router.get('/', (req: AuthRequest, res: Response) => {
  let leads = db.getLeads();
  const { status, source } = req.query;
  if (status) {
    leads = leads.filter((l) => l.status === status);
  }
  if (source) {
    leads = leads.filter((l) => l.source === source);
  }
  res.json({ success: true, data: leads });
});

// POST /leads
router.post('/', validateBody(createLeadSchema), (req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  const lead = db.createLead({
    ...req.body,
    clinicId: clinic.id,
  });
  db.createAuditLog({
    clinicId: clinic.id,
    action: 'LEAD_CREATED',
    entityType: 'LEAD',
    entityId: lead.id,
    details: { name: lead.name, phone: lead.phone, status: lead.status },
  });
  res.status(201).json({ success: true, data: lead });
});

// GET /leads/:id
router.get('/:id', (req: AuthRequest, res: Response) => {
  const lead = db.getLeadById(req.params.id as string);
  if (!lead) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } });
    return;
  }
  res.json({ success: true, data: lead });
});

// PATCH /leads/:id
router.patch('/:id', validateBody(updateLeadSchema), (req: AuthRequest, res: Response) => {
  const lead = db.updateLead(req.params.id as string, req.body);
  if (!lead) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } });
    return;
  }
  res.json({ success: true, data: lead });
});

export default router;
