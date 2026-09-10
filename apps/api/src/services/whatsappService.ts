import { config } from '../config';
import { db } from '../database/db';
import { agentEngine } from '../ai/agentEngine';
import { leadService } from './leadService';
import { WhatsAppMessage } from '@dermo/types';

export class WhatsAppService {
  private static instance: WhatsAppService;

  private constructor() {}

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  // Webhook Verification (Meta challenge)
  verifyWebhook(mode?: string, token?: string, challenge?: string): string | null {
    if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
      return challenge || 'OK';
    }
    return null;
  }

  // Inbound Webhook Event Processing with Idempotency & Deduplication
  async handleInboundWebhook(body: any): Promise<{ processed: boolean; reason?: string }> {
    try {
      const entry = body?.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (!message) {
        return { processed: false, reason: 'No message payload found' };
      }

      const providerMessageId = message.id;
      const from = message.from;
      const text = message.text?.body || message.interactive?.button_reply?.title || '';
      const patientName = value?.contacts?.[0]?.profile?.name || 'WhatsApp Patient';

      // 1. Idempotency Check
      if (providerMessageId && db.isMessageProcessed(providerMessageId)) {
        return { processed: false, reason: 'DUPLICATE_MESSAGE' };
      }
      if (providerMessageId) {
        db.markMessageProcessed(providerMessageId);
      }

      // 2. Ensure Lead & Conversation
      const lead = leadService.getOrCreateLead({ phone: from, name: patientName, source: 'WHATSAPP' });
      let conv = db.getConversationByPhone(from);
      if (!conv) {
        conv = db.createConversation({
          clinicId: db.getClinic().id,
          leadId: lead.id,
          patientPhone: from,
          patientName: lead.name,
          state: 'START',
          mode: 'AI',
          unreadCount: 0,
          lastMessageAt: new Date().toISOString(),
        });
      }

      // 3. Persist Inbound Message
      db.createMessage({
        conversationId: conv.id,
        providerMessageId,
        direction: 'INBOUND',
        sender: 'PATIENT',
        senderName: patientName,
        content: text,
        status: 'READ',
      });

      // 4. If conversation in Human Takeover mode, do not auto-respond
      if (conv.mode === 'HUMAN_TAKEOVER') {
        return { processed: true, reason: 'Conversation owned by human staff' };
      }

      // 5. Process through AI Agent Engine
      const aiResponse = await agentEngine.processMessage({
        patientPhone: from,
        patientName,
        content: text,
        conversationId: conv.id,
      });

      if (aiResponse.replyText) {
        // Persist AI Outbound Message
        db.createMessage({
          conversationId: conv.id,
          direction: 'OUTBOUND',
          sender: 'AI',
          senderName: 'Dermo AI',
          content: aiResponse.replyText,
          interactiveType: aiResponse.suggestedQuickReplies?.length ? 'quick_reply' : undefined,
          interactiveOptions: aiResponse.suggestedQuickReplies?.map((q, idx) => ({ id: `opt_${idx}`, title: q })),
          status: 'SENT',
        });
      }

      return { processed: true };
    } catch (err: any) {
      console.error('Error processing WhatsApp webhook:', err);
      return { processed: false, reason: err.message };
    }
  }

  // Interactive WhatsApp Simulator Dispatcher
  async handleSimulatorMessage(params: { phone: string; name?: string; message: string }): Promise<{
    userMessage: WhatsAppMessage;
    aiMessage?: WhatsAppMessage;
  }> {
    const { phone, name = 'Patient User', message } = params;

    const lead = leadService.getOrCreateLead({ phone, name, source: 'WHATSAPP' });
    let conv = db.getConversationByPhone(phone);
    if (!conv) {
      conv = db.createConversation({
        clinicId: db.getClinic().id,
        leadId: lead.id,
        patientPhone: phone,
        patientName: lead.name,
        state: 'START',
        mode: 'AI',
        unreadCount: 0,
        lastMessageAt: new Date().toISOString(),
      });
    }

    // Persist User Message
    const userMsg = db.createMessage({
      conversationId: conv.id,
      direction: 'INBOUND',
      sender: 'PATIENT',
      senderName: name,
      content: message,
      status: 'READ',
    });

    if (conv.mode === 'HUMAN_TAKEOVER') {
      return { userMessage: userMsg };
    }

    // Process via AI Agent
    const aiResponse = await agentEngine.processMessage({
      patientPhone: phone,
      patientName: name,
      content: message,
      conversationId: conv.id,
    });

    let aiMsg: WhatsAppMessage | undefined;
    if (aiResponse.replyText) {
      aiMsg = db.createMessage({
        conversationId: conv.id,
        direction: 'OUTBOUND',
        sender: 'AI',
        senderName: 'Dermo AI',
        content: aiResponse.replyText,
        interactiveType: aiResponse.suggestedQuickReplies?.length ? 'quick_reply' : undefined,
        interactiveOptions: aiResponse.suggestedQuickReplies?.map((q, idx) => ({ id: `opt_${idx}`, title: q })),
        status: 'DELIVERED',
      });
    }

    return { userMessage: userMsg, aiMessage: aiMsg };
  }
}

export const whatsappService = WhatsAppService.getInstance();
