import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { sendStaffMessageSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /conversations
router.get('/', (_req: AuthRequest, res: Response) => {
  const conversations = db.getConversations();
  res.json({ success: true, data: conversations });
});

// GET /conversations/:id
router.get('/:id', (req: AuthRequest, res: Response) => {
  const conversation = db.getConversationById(req.params.id as string);
  if (!conversation) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }
  res.json({ success: true, data: conversation });
});

// GET /conversations/:id/messages
router.get('/:id/messages', (req: AuthRequest, res: Response) => {
  const messages = db.getMessagesByConversationId(req.params.id as string);
  res.json({ success: true, data: messages });
});

// POST /conversations/:id/messages (Staff manual reply)
router.post('/:id/messages', validateBody(sendStaffMessageSchema), (req: AuthRequest, res: Response) => {
  const conv = db.getConversationById(req.params.id as string);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  const { content, mediaUrl } = req.body;
  const staffName = req.user?.email || 'Clinic Staff';

  const message = db.createMessage({
    conversationId: conv.id,
    direction: 'OUTBOUND',
    sender: 'STAFF',
    senderName: staffName,
    content,
    mediaUrl,
    status: 'SENT',
  });

  db.createAuditLog({
    clinicId: conv.clinicId,
    action: 'STAFF_MESSAGE_SENT',
    entityType: 'CONVERSATION',
    entityId: conv.id,
    details: { content: content.substring(0, 50) },
  });

  res.status(201).json({ success: true, data: message });
});

// POST /conversations/:id/takeover (1-click Take Over by Receptionist)
router.post('/:id/takeover', (req: AuthRequest, res: Response) => {
  const conv = db.getConversationById(req.params.id as string);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  const updated = db.updateConversation(conv.id, {
    mode: 'HUMAN_TAKEOVER',
    state: 'HANDOFF',
    assignedStaffId: req.user?.id,
  });

  db.createAuditLog({
    clinicId: conv.clinicId,
    action: 'HUMAN_TAKEOVER_START',
    entityType: 'CONVERSATION',
    entityId: conv.id,
    details: { staff: req.user?.email },
  });

  res.json({ success: true, data: updated, message: 'AI paused. Human staff takeover active.' });
});

// POST /conversations/:id/release (Return Conversation to AI)
router.post('/:id/release', (req: AuthRequest, res: Response) => {
  const conv = db.getConversationById(req.params.id as string);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  const updated = db.updateConversation(conv.id, {
    mode: 'AI',
    state: 'START',
    assignedStaffId: undefined,
  });

  db.createAuditLog({
    clinicId: conv.clinicId,
    action: 'RETURN_TO_AI',
    entityType: 'CONVERSATION',
    entityId: conv.id,
    details: { staff: req.user?.email },
  });

  res.json({ success: true, data: updated, message: 'Conversation returned to AI assistant.' });
});

export default router;
