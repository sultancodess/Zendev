import { Router, Request, Response } from 'express';
import { whatsappService } from '../services/whatsappService';
import { validateBody } from '../middleware/validator';
import { simulatorMessageSchema } from '@dermo/schemas';
import { config } from '../config';

const router = Router();

// GET /webhooks/whatsapp (Meta Webhook Challenge Verification)
router.get('/webhooks/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  const verified = whatsappService.verifyWebhook(mode, token, challenge);
  if (verified) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Verification token mismatch' } });
  }
});

// POST /webhooks/whatsapp (Inbound Webhook Events with Deduplication)
router.post('/webhooks/whatsapp', async (req: Request, res: Response) => {
  // Acknowledge immediately before processing (NFR-001 & SRS-005)
  res.status(200).send('EVENT_RECEIVED');

  // Process event asynchronously
  whatsappService.handleInboundWebhook(req.body).catch((err) => {
    console.error('Async WhatsApp processing error:', err);
  });
});

// POST /whatsapp/simulator/send (For Dashboard Mobile Simulator Testing)
router.post('/whatsapp/simulator/send', validateBody(simulatorMessageSchema), async (req: Request, res: Response) => {
  const result = await whatsappService.handleSimulatorMessage(req.body);
  res.json({ success: true, data: result });
});

// GET /whatsapp/status (Status of Meta connection)
router.get('/whatsapp/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      connected: true,
      phoneNumberId: config.whatsapp.phoneNumberId,
      apiVersion: config.whatsapp.apiVersion,
      webhookUrl: `${config.appUrl}/api/v1/webhooks/whatsapp`,
      verifyTokenConfigured: Boolean(config.whatsapp.verifyToken),
    },
  });
});

export default router;
