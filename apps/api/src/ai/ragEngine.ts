import { vectorStore } from './vectorStore';
import { db } from '../database/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

export class RagEngine {
  private static instance: RagEngine;
  private aiClient: GoogleGenerativeAI | null = null;

  private constructor() {
    if (config.geminiApiKey) {
      try {
        this.aiClient = new GoogleGenerativeAI(config.geminiApiKey);
      } catch (err) {
        console.warn('⚠️ Gemini AI client initialization deferred.');
      }
    }
  }

  public static getInstance(): RagEngine {
    if (!RagEngine.instance) {
      RagEngine.instance = new RagEngine();
    }
    return RagEngine.instance;
  }

  // Retrieve grounded context for an inquiry
  async retrieveGroundedContext(query: string): Promise<{ contextText: string; sources: string[] }> {
    const clinic = db.getClinic();
    const doctors = db.getDoctors();
    const services = db.getServices();
    const faqs = db.getFaqs();

    // 1. Vector Search for relevant knowledge chunks
    const vectorResults = await vectorStore.search(query, 3);
    const vectorSnippets = vectorResults.map((r) => r.chunk.content);
    const sources = vectorResults.map((r) => r.chunk.metadata.title || 'Knowledge Base');

    // 2. Structured Clinic Facts
    const clinicContext = `
CLINIC FACTS:
- Clinic: ${clinic.name} (${clinic.tagline || ''})
- Address: ${clinic.address}, ${clinic.city}
- Phone: ${clinic.phone} | Email: ${clinic.email}
- Timing: Mon-Sat 9:00 AM - 8:00 PM, Sun 10:00 AM - 4:00 PM
- Valet Parking: Complimentary valet parking available right in front of the clinic.

DOCTORS:
${doctors
  .map(
    (d) =>
      `- ${d.name} (${d.title}): Qualification: ${d.qualification}, Experience: ${d.experienceYears} yrs, Consultation: ₹${d.consultationFee}, Specialties: ${d.specialty.join(', ')}`
  )
  .join('\n')}

SERVICES & PRICING:
${services
  .map(
    (s) =>
      `- ${s.name}: ₹${s.price} (${s.durationMinutes} mins) | Deposit: ${s.depositRequired ? `₹${s.depositAmount || 500}` : 'None'}. Description: ${s.description}`
  )
  .join('\n')}

APPROVED FAQS:
${faqs
  .filter((f) => f.isApproved)
  .slice(0, 5)
  .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
  .join('\n\n')}

RELEVANT KNOWLEDGE CHUNKS:
${vectorSnippets.join('\n\n')}
`;

    return {
      contextText: clinicContext,
      sources: Array.from(new Set(sources)),
    };
  }

  // Generate grounded response using Gemini AI or deterministic fallback
  async generateGroundedAnswer(
    userMessage: string,
    history: { sender: string; content: string }[] = []
  ): Promise<string> {
    const { contextText } = await this.retrieveGroundedContext(userMessage);

    if (this.aiClient && config.geminiApiKey) {
      try {
        const model = this.aiClient.getGenerativeModel({ model: config.geminiModel });
        const systemPrompt = `You are Dermo AI, an elite, warm, and professional WhatsApp assistant for ${db.getClinic().name}.
CRITICAL GROUNDING RULES:
1. ONLY provide facts, fees, timings, and procedures present in the provided CLINIC FACTS below.
2. ZERO HALLUCINATIONS: If asked about a procedure not listed or a medical question outside the facts, state you do not know or offer to connect with Dr. Priya / Dr. Rohan.
3. NEVER prescribe drugs, dosage, or diagnose skin conditions.
4. Keep replies concise, friendly, formatted cleanly for WhatsApp with bullet points and bold highlights.
5. End with a helpful question or next step (e.g. asking if they'd like to reserve a slot).

${contextText}`;

        const prompt = `${systemPrompt}\n\nRecent Conversation:\n${history
          .slice(-4)
          .map((h) => `${h.sender}: ${h.content}`)
          .join('\n')}\n\nPatient: ${userMessage}\nDermo AI:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          return text.trim();
        }
      } catch (err) {
        console.warn('⚠️ Gemini generation error, falling back to rule-grounded generator:', err);
      }
    }

    return this.ruleGroundedFallback(userMessage);
  }

  // High quality deterministic fallback generator
  private ruleGroundedFallback(query: string): string {
    const lower = query.toLowerCase();
    const clinic = db.getClinic();
    const doctors = db.getDoctors();
    const services = db.getServices();

    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate')) {
      const matchedSvc = services.find((s) => lower.includes(s.name.toLowerCase().split(' ')[0]));
      if (matchedSvc) {
        return `✨ **${matchedSvc.name}** is priced at **₹${matchedSvc.price.toLocaleString()}** (${matchedSvc.durationMinutes} minutes session).\n\nKey benefits:\n${matchedSvc.benefits.map((b) => `• ${b}`).join('\n')}\n\nWould you like me to check available appointment slots for this week?`;
      }
      return `Here are our popular treatment pricing at **${clinic.name}**:\n\n${services.slice(0, 4).map((s) => `• **${s.name}**: ₹${s.price.toLocaleString()} (${s.durationMinutes} mins)`).join('\n')}\n\nDr. Priya consultation: ₹1,000 | Dr. Rohan consultation: ₹800.\nWould you like to book a consultation?`;
    }

    if (lower.includes('doctor') || lower.includes('dr.') || lower.includes('priya') || lower.includes('rohan')) {
      return `🩺 **Our Senior Doctors at ${clinic.name}**:\n\n${doctors.map((d) => `• **${d.name}** (${d.qualification})\n  Specialties: ${d.specialty.join(', ')}\n  Experience: ${d.experienceYears}+ years | Fee: ₹${d.consultationFee}`).join('\n\n')}\n\nBoth doctors are available Monday to Saturday 10:00 AM - 6:00 PM. Would you like to schedule a slot?`;
    }

    if (lower.includes('timing') || lower.includes('hours') || lower.includes('open')) {
      return `🕒 **${clinic.name} Working Hours**:\n• Monday – Saturday: **9:00 AM – 8:00 PM**\n• Sunday: **10:00 AM – 4:00 PM**\n\nDoctor consultation shifts are **10:00 AM – 6:00 PM**. What day suits you best?`;
    }

    if (lower.includes('location') || lower.includes('address') || lower.includes('parking')) {
      return `📍 **${clinic.name}** is located at:\n${clinic.address}, ${clinic.city}.\n\n🚗 Dedicated complimentary valet parking is available at our entrance. Would you like assistance with directions or an appointment?`;
    }

    return `Hello! 👋 Welcome to **${clinic.name}**.\n\nI can help you with:\n1. 🩺 Doctor Profiles & Consultation Booking\n2. ✨ Treatment Pricing (HydraFacial, Lasers, PRP, Peels)\n3. 🕒 Working Hours & Location\n4. 💳 Advance Deposit Payment via Razorpay\n\nHow may I assist your skin & hair care goals today?`;
  }
}

export const ragEngine = RagEngine.getInstance();
