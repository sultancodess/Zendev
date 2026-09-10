import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody, validateQuery } from '../middleware/validator';
import {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
  cancelAppointmentSchema,
  availabilityQuerySchema,
} from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';
import { appointmentService } from '../services/appointmentService';

const router = Router();

// GET /appointments
router.get('/', (_req: AuthRequest, res: Response) => {
  const appointments = db.getAppointments();
  res.json({ success: true, data: appointments });
});

// GET /appointments/availability
router.get('/availability', validateQuery(availabilityQuerySchema), (req: AuthRequest, res: Response) => {
  const { date, doctorId, serviceId } = req.query as any;
  const availability = appointmentService.getAvailability({ date, doctorId, serviceId });
  res.json({ success: true, data: availability });
});

// POST /appointments
router.post('/', validateBody(createAppointmentSchema), (req: AuthRequest, res: Response) => {
  const appointment = appointmentService.createAppointment({
    ...req.body,
    idempotencyKey: (req.headers['idempotency-key'] as string) || req.body.idempotencyKey,
  });
  res.status(201).json({ success: true, data: appointment });
});

// GET /appointments/:id
router.get('/:id', (req: AuthRequest, res: Response) => {
  const appointment = db.getAppointmentById(req.params.id);
  if (!appointment) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found' } });
    return;
  }
  res.json({ success: true, data: appointment });
});

// POST /appointments/:id/reschedule
router.post('/:id/reschedule', validateBody(rescheduleAppointmentSchema), (req: AuthRequest, res: Response) => {
  const { date, startTime, reason } = req.body;
  const appointment = appointmentService.rescheduleAppointment(req.params.id, date, startTime, reason);
  res.json({ success: true, data: appointment });
});

// POST /appointments/:id/cancel
router.post('/:id/cancel', validateBody(cancelAppointmentSchema), (req: AuthRequest, res: Response) => {
  const { reason } = req.body;
  const appointment = appointmentService.cancelAppointment(req.params.id, reason);
  res.json({ success: true, data: appointment });
});

export default router;
