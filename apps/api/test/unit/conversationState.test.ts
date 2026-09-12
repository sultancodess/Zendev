import { describe, it } from 'node:test';
import assert from 'node:assert';
import { db } from '../../src/database/db';
import { agentEngine } from '../../src/ai/agentEngine';

describe('Unit Tests: Conversation State Machine & Human Takeover Console', () => {
  it('should pause automated AI when human takeover is active', async () => {
    const phone = '+919988776655';
    
    // Create conversation
    let conv = db.createConversation({
      clinicId: db.getClinic().id,
      leadId: 'lead_test_1',
      patientPhone: phone,
      patientName: 'Test Patient',
      state: 'START',
      mode: 'AI',
      unreadCount: 0,
      lastMessageAt: new Date().toISOString(),
    });

    // 1. In AI mode, AI processes message
    const res1 = await agentEngine.processMessage({
      patientPhone: phone,
      content: 'What are your consultation timings?',
      conversationId: conv.id,
    });
    assert.ok(res1.replyText.length > 0);

    // 2. Staff takes over (mode = HUMAN_TAKEOVER)
    db.updateConversation(conv.id, {
      mode: 'HUMAN_TAKEOVER',
      state: 'HANDOFF',
      assignedStaffId: 'staff_1',
    });

    // 3. In HUMAN_TAKEOVER mode, AI responds with empty reply (paused)
    const res2 = await agentEngine.processMessage({
      patientPhone: phone,
      content: 'Can I book for tomorrow?',
      conversationId: conv.id,
    });
    assert.strictEqual(res2.replyText, '');

    // 4. Return to AI (mode = AI)
    db.updateConversation(conv.id, {
      mode: 'AI',
      state: 'START',
      assignedStaffId: undefined,
    });

    const res3 = await agentEngine.processMessage({
      patientPhone: phone,
      content: 'Hi',
      conversationId: conv.id,
    });
    assert.ok(res3.replyText.length > 0);
  });
});
