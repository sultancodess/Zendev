import { Router, Response } from 'express';
import { db } from '../database/db';
import { validateBody } from '../middleware/validator';
import { createFaqSchema, updateFaqSchema, createKnowledgeDocSchema } from '@dermo/schemas';
import { AuthRequest } from '../middleware/auth';
import { vectorStore } from '../ai/vectorStore';

const router = Router();

// ==========================================
// FAQs
// ==========================================
// GET /faqs
router.get('/faqs', (_req: AuthRequest, res: Response) => {
  const faqs = db.getFaqs();
  res.json({ success: true, data: faqs });
});

// POST /faqs
router.post('/faqs', validateBody(createFaqSchema), (req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  const faq = db.createFaq({
    ...req.body,
    clinicId: clinic.id,
    viewCount: 0,
  });
  db.createAuditLog({
    clinicId: clinic.id,
    action: 'FAQ_CREATED',
    entityType: 'KNOWLEDGE',
    entityId: faq.id,
    details: { question: faq.question },
  });
  res.status(201).json({ success: true, data: faq });
});

// PATCH /faqs/:id
router.patch('/faqs/:id', validateBody(updateFaqSchema), (req: AuthRequest, res: Response) => {
  const faq = db.updateFaq(req.params.id, req.body);
  if (!faq) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'FAQ not found' } });
    return;
  }
  res.json({ success: true, data: faq });
});

// DELETE /faqs/:id
router.delete('/faqs/:id', (req: AuthRequest, res: Response) => {
  const deleted = db.deleteFaq(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'FAQ not found' } });
    return;
  }
  res.json({ success: true, data: { message: 'FAQ deleted successfully' } });
});

// ==========================================
// Knowledge Documents & RAG Indexing
// ==========================================
// GET /knowledge/documents
router.get('/knowledge/documents', (_req: AuthRequest, res: Response) => {
  const docs = db.getKnowledgeDocuments();
  res.json({ success: true, data: docs });
});

// POST /knowledge/documents
router.post('/knowledge/documents', validateBody(createKnowledgeDocSchema), async (req: AuthRequest, res: Response) => {
  const clinic = db.getClinic();
  const { title, category, content } = req.body;

  const doc = db.createKnowledgeDocument({
    clinicId: clinic.id,
    title,
    category,
    content,
    chunkCount: 1,
    status: 'PROCESSING',
    version: 1,
  });

  // Background indexing simulation
  try {
    await vectorStore.indexChunk(doc.id, content, {
      title,
      category,
      clinicId: clinic.id,
      version: 1,
    });
    db.updateKnowledgeDocument(doc.id, { status: 'READY' });
  } catch (err: any) {
    db.updateKnowledgeDocument(doc.id, { status: 'FAILED', errorMessage: err.message });
  }

  res.status(201).json({ success: true, data: db.getKnowledgeDocuments().find((d) => d.id === doc.id) });
});

// POST /knowledge/documents/:id/reindex
router.post('/knowledge/documents/:id/reindex', async (req: AuthRequest, res: Response) => {
  const doc = db.getKnowledgeDocuments().find((d) => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } });
    return;
  }

  db.updateKnowledgeDocument(doc.id, { status: 'PROCESSING' });
  try {
    await vectorStore.indexChunk(doc.id, doc.content, {
      title: doc.title,
      category: doc.category,
      clinicId: doc.clinicId,
      version: doc.version + 1,
    });
    const updated = db.updateKnowledgeDocument(doc.id, {
      status: 'READY',
      version: doc.version + 1,
      errorMessage: undefined,
    });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    const updated = db.updateKnowledgeDocument(doc.id, { status: 'FAILED', errorMessage: err.message });
    res.status(500).json({ success: false, data: updated, error: { code: 'INDEXING_FAILED', message: err.message } });
  }
});

export default router;
