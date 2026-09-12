import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { createDoctorSchema, updateDoctorSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';
import { appointmentService } from '../services/appointmentService';

const router = Router();

// GET /doctors
router.get('/', (_req: AuthRequest, res: Response) => {
  const doctors = db.getDoctors();
  res.json({ success: true, data: doctors });
});

// POST /doctors
router.post('/', validateBody(createDoctorSchema), (req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  const doctor = db.createDoctor({
    ...req.body,
    clinicId: clinic.id,
  });
  db.createAuditLog({
    clinicId: clinic.id,
    action: 'DOCTOR_CREATED',
    entityType: 'DOCTOR',
    entityId: doctor.id,
    details: { name: doctor.name },
  });
  res.status(201).json({ success: true, data: doctor });
});

// GET /doctors/:id
router.get('/:id', (req: AuthRequest, res: Response) => {
  const doctor = db.getDoctorById(req.params.id as string);
  if (!doctor) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
    return;
  }
  res.json({ success: true, data: doctor });
});

// PATCH /doctors/:id
router.patch('/:id', validateBody(updateDoctorSchema), (req: AuthRequest, res: Response) => {
  const doctor = db.updateDoctor(req.params.id as string, req.body);
  if (!doctor) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
    return;
  }
  res.json({ success: true, data: doctor });
});

// GET /doctors/:id/availability
router.get('/:id/availability', (req: AuthRequest, res: Response) => {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  const availability = appointmentService.getAvailability({ date, doctorId: req.params.id as string });
  res.json({ success: true, data: availability });
});

export default router;
