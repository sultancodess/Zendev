import { Router, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /analytics/overview
router.get('/overview', (_req: AuthRequest, res: Response) => {
  const overview = analyticsService.getOverview();
  res.json({ success: true, data: overview });
});

// GET /analytics/timeseries
router.get('/timeseries', (_req: AuthRequest, res: Response) => {
  const timeseries = analyticsService.getTimeseries();
  res.json({ success: true, data: timeseries });
});

export default router;
