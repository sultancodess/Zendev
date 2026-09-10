import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { createPaymentOrderSchema, verifyPaymentSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';
import { paymentService } from '../services/paymentService';

const router = Router();

// GET /payments
router.get('/', (_req: AuthRequest, res: Response) => {
  const payments = db.getPayments();
  res.json({ success: true, data: payments });
});

// POST /payments/create-order
router.post('/create-order', validateBody(createPaymentOrderSchema), async (req: AuthRequest, res: Response) => {
  const order = await paymentService.createOrder(req.body);
  res.status(201).json({ success: true, data: order });
});

// POST /payments/verify
router.post('/verify', validateBody(verifyPaymentSchema), (req: AuthRequest, res: Response) => {
  const isValid = paymentService.verifySignature(req.body);
  if (!isValid) {
    res.status(400).json({
      success: false,
      error: { code: 'PAYMENT_VERIFICATION_FAILED', message: 'Razorpay signature is invalid.' },
    });
    return;
  }
  res.json({ success: true, message: 'Payment verified and captured successfully.' });
});

export default router;
