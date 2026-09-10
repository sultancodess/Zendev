import { Router, Response } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /audit-logs
router.get('/', (_req: AuthRequest, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ success: true, data: logs });
});

export default router;
