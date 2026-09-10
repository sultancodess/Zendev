import { Router } from 'express';
import authRoutes from './authRoutes';
import clinicRoutes from './clinicRoutes';
import doctorRoutes from './doctorRoutes';
import serviceRoutes from './serviceRoutes';
import appointmentRoutes from './appointmentRoutes';
import leadRoutes from './leadRoutes';
import conversationRoutes from './conversationRoutes';
import knowledgeRoutes from './knowledgeRoutes';
import paymentRoutes from './paymentRoutes';
import whatsappRoutes from './whatsappRoutes';
import analyticsRoutes from './analyticsRoutes';
import auditRoutes from './auditRoutes';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public / Webhook routes
router.use('/', whatsappRoutes);
router.use('/auth', authRoutes);

// Protected routes
router.use('/clinic', authenticate, clinicRoutes);
router.use('/doctors', authenticate, doctorRoutes);
router.use('/services', authenticate, serviceRoutes);
router.use('/appointments', authenticate, appointmentRoutes);
router.use('/leads', authenticate, leadRoutes);
router.use('/conversations', authenticate, conversationRoutes);
router.use('/knowledge', authenticate, knowledgeRoutes);
router.use('/', authenticate, knowledgeRoutes); // For /faqs
router.use('/payments', authenticate, paymentRoutes);
router.use('/analytics', authenticate, analyticsRoutes);
router.use('/audit-logs', authenticate, auditRoutes);

export default router;
