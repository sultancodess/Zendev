import { classifyMessage } from './intentClassifier';
import { ragEngine } from './ragEngine';
import { db } from '../database/db';
import { GroundedAIResponse } from '@dermo/types';
import { appointmentService } from '../services/appointmentService';
import { leadService } from '../services/leadService';
import { paymentService } from '../services/paymentService';

export class AgentEngine {
  private static instance: AgentEngine;

  private constructor() {}

  public static getInstance(): AgentEngine {
    if (!AgentEngine.instance) {
      AgentEngine.instance = new AgentEngine();
    }
    return AgentEngine.instance;
  }

  // Process incoming patient message through LangChain / AI Agent tool execution pipeline
  async processMessage(params: {
    patientPhone: string;
    patientName?: string;
    content: string;
    conversationId?: string;
  }): Promise<GroundedAIResponse> {
    const { patientPhone, patientName, content, conversationId } = params;

    // 1. Ensure Lead & Conversation exist
    const lead = leadService.getOrCreateLead({
      phone: patientPhone,
      name: patientName || 'WhatsApp Patient',
      source: 'WHATSAPP',
    });

    let conv = conversationId
      ? db.getConversationById(conversationId)
      : db.getConversationByPhone(patientPhone);

    if (!conv) {
      conv = db.createConversation({
        clinicId: db.getClinic().id,
        leadId: lead.id,
        patientPhone,
        patientName: lead.name,
        state: 'START',
        mode: 'AI',
        unreadCount: 0,
        lastMessageAt: new Date().toISOString(),
      });
    }

    // 2. If human takeover is active, stop automated AI processing
    if (conv.mode === 'HUMAN_TAKEOVER') {
      return {
        replyText: '',
        needsHandoff: false,
        updatedState: 'HANDOFF',
      };
    }

    // 3. Classify message intent & safety
    const classification = await classifyMessage(content);

    // 4. Handle Safety Escalation (Medical Non-diagnostic or Emergency)
    if (classification.safety === 'EMERGENCY_ESCALATE') {
      db.updateConversation(conv.id, { mode: 'HUMAN_TAKEOVER', state: 'HANDOFF' });
      db.createAuditLog({
        clinicId: conv.clinicId,
        action: 'EMERGENCY_ESCALATION',
        entityType: 'CONVERSATION',
        entityId: conv.id,
        details: { message: content },
      });

      return {
        replyText: `🚨 **Immediate Attention**: If this is a medical emergency or severe allergic reaction, please proceed to the nearest emergency department or call 112. We have alerted Dr. Priya Sharma and our clinic staff to reach out to you immediately.`,
        needsHandoff: true,
        handoffReason: 'EMERGENCY_SIGNAL',
        updatedState: 'HANDOFF',
      };
    }

    if (classification.safety === 'MEDICAL_NON_DIAGNOSTIC') {
      return {
        replyText: `⚠️ Prescription medication and specific clinical diagnosis cannot be given over automated chat. Dr. Priya Sharma and Dr. Rohan Mehta can evaluate this during an in-clinic consultation.\n\nWould you like me to check open consultation slots for you this week?`,
        suggestedQuickReplies: ['Book Dr. Priya', 'Book Dr. Rohan', 'Talk to Receptionist'],
        needsHandoff: false,
        updatedState: 'QUALIFICATION',
      };
    }

    // 5. Handle Human Request
    if (classification.intent === 'HUMAN_REQUEST') {
      db.updateConversation(conv.id, { mode: 'HUMAN_TAKEOVER', state: 'HANDOFF' });
      return {
        replyText: `👩‍💼 Sure! I have notified our senior clinic receptionist (Sneha). They will review your chat and reply directly here shortly.\n\n(AI Assistant is now on hold for this conversation).`,
        needsHandoff: true,
        handoffReason: 'STAFF_REQUEST',
        updatedState: 'HANDOFF',
      };
    }

    // 6. Handle Appointment Booking Intent
    if (classification.intent === 'APPOINTMENT_BOOKING' || classification.intent === 'APPOINTMENT_AVAILABILITY') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const targetDate = classification.extractedEntities.date || tomorrow.toISOString().split('T')[0];

      const doctors = db.getDoctors();
      const selectedDoc = classification.extractedEntities.doctorName
        ? doctors.find((d) => d.name.toLowerCase().includes(classification.extractedEntities.doctorName!.toLowerCase())) || doctors[0]
        : doctors[0];

      const availability = appointmentService.getAvailability({
        date: targetDate,
        doctorId: selectedDoc.id,
      });

      const freeSlots = availability.slots.filter((s) => s.available).slice(0, 4);

      if (freeSlots.length > 0) {
        const slotText = freeSlots.map((s) => `• **${s.startTime}**`).join('\n');
        return {
          replyText: `📅 Here are the available slots for **${selectedDoc.name}** on **${targetDate}**:\n\n${slotText}\n\nWhich time slot works best for you?`,
          suggestedQuickReplies: freeSlots.map((s) => `Book ${s.startTime}`),
          toolExecuted: 'get_available_slots',
          toolResult: { date: targetDate, doctorId: selectedDoc.id, freeSlots },
          needsHandoff: false,
          updatedState: 'BOOKING',
        };
      }
    }

    // 7. Handle Payment / Deposit Inquiries
    if (classification.intent === 'PAYMENT_QUERY') {
      return {
        replyText: `💳 **Payment Options at DermaCare**:\n• We accept **UPI, Credit/Debit Cards, NetBanking, and Cash**.\n• We support secure instant payments via **Razorpay**.\n• Advance appointment holding deposit (₹500) is 100% refundable with 4+ hours notice.\n\nWould you like a secure Razorpay deposit link for your consultation?`,
        suggestedQuickReplies: ['Pay ₹500 Deposit', 'View Treatments', 'Doctor Timings'],
        needsHandoff: false,
      };
    }

    // 8. Grounded RAG Query Engine Execution
    const history = db.getMessagesByConversationId(conv.id).map((m) => ({
      sender: m.sender,
      content: m.content,
    }));

    const groundedAnswer = await ragEngine.generateGroundedAnswer(content, history);

    return {
      replyText: groundedAnswer,
      suggestedQuickReplies: ['View Pricing', 'Book Appointment', 'Clinic Location'],
      needsHandoff: false,
      updatedState: 'INFORMATION',
    };
  }
}

export const agentEngine = AgentEngine.getInstance();
