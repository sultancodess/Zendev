import { IntentType, AIClassificationResult, SafetyClassification } from '@dermo/types';
import { checkSafety } from './safetyGuard';
import { config } from '../config';

export async function classifyMessage(message: string): Promise<AIClassificationResult> {
  // 1. First run safety guardrail
  const safetyCheck = checkSafety(message);
  if (!safetyCheck.isSafe) {
    return {
      intent: safetyCheck.classification === 'EMERGENCY_ESCALATE' ? 'EMERGENCY_SIGNAL' : 'MEDICAL_QUESTION',
      confidence: 0.98,
      safety: safetyCheck.classification,
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 2. High-speed pattern matching & deterministic rules
  const lower = message.toLowerCase().trim();

  // Greeting
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening)|hola)/i.test(lower) && lower.length < 25) {
    return {
      intent: 'GREETING',
      confidence: 0.95,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Human Request / Handoff
  if (/(talk to human|speak with doctor|receptionist|staff|real person|call me|connect to human)/i.test(lower)) {
    return {
      intent: 'HUMAN_REQUEST',
      confidence: 0.95,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Reschedule
  if (/(reschedule|change time|change date|postpone|shift appointment|reschedule slot)/i.test(lower)) {
    return {
      intent: 'APPOINTMENT_RESCHEDULE',
      confidence: 0.92,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Cancel
  if (/(cancel appointment|cancel booking|cannot come|call off|drop appointment)/i.test(lower)) {
    return {
      intent: 'APPOINTMENT_CANCEL',
      confidence: 0.92,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Booking
  if (/(book|schedule|reserve|appointment|want a slot|book for tomorrow|fix a time)/i.test(lower)) {
    return {
      intent: 'APPOINTMENT_BOOKING',
      confidence: 0.9,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Availability
  if (/(available|slots|timings|open timings|free slots|doctor available)/i.test(lower)) {
    return {
      intent: 'APPOINTMENT_AVAILABILITY',
      confidence: 0.88,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Price
  if (/(price|cost|charge|fees|how much|rate|package price|charges|deposit)/i.test(lower)) {
    return {
      intent: 'PRICE_INFORMATION',
      confidence: 0.9,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Doctor Information
  if (/(doctor|dr\.|priya|rohan|dermatologist|specialist|experience|qualification)/i.test(lower)) {
    return {
      intent: 'DOCTOR_INFORMATION',
      confidence: 0.88,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Hours / Timings
  if (/(open today|closing time|working hours|clinic timing|sunday open)/i.test(lower)) {
    return {
      intent: 'WORKING_HOURS',
      confidence: 0.9,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Location / Parking
  if (/(address|where are you located|location|directions|landmark|parking|koramangala)/i.test(lower)) {
    return {
      intent: 'CLINIC_LOCATION',
      confidence: 0.92,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Service Info
  if (/(hydrafacial|laser|hair reduction|prp|chemical peel|botox|acne|scars|pigmentation|facial|glow)/i.test(lower)) {
    return {
      intent: 'SERVICE_INFORMATION',
      confidence: 0.89,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // Payment Query
  if (/(razorpay|upi|card|google pay|phonepe|advance|deposit refund)/i.test(lower)) {
    return {
      intent: 'PAYMENT_QUERY',
      confidence: 0.88,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  return {
    intent: 'FAQ_QUERY',
    confidence: 0.75,
    safety: 'SAFE',
    language: detectLanguage(message),
    extractedEntities: extractEntities(message),
  };
}

function detectLanguage(text: string): 'en' | 'hi' | 'hinglish' {
  const lower = text.toLowerCase();
  if (/(kya|kaise|kitna|hoga|chahiye|kab|hai|dhanyawad|shukriya|namaste)/i.test(lower)) {
    return 'hinglish';
  }
  return 'en';
}

function extractEntities(text: string): {
  serviceName?: string;
  doctorName?: string;
  date?: string;
  time?: string;
} {
  const lower = text.toLowerCase();
  const entities: any = {};

  if (lower.includes('hydrafacial')) entities.serviceName = 'HydraFacial MD Elite Glow';
  else if (lower.includes('laser')) entities.serviceName = 'Triple-Wavelength Laser Hair Reduction';
  else if (lower.includes('prp') || lower.includes('hair loss')) entities.serviceName = 'GFC & PRP Hair Restoration Therapy';
  else if (lower.includes('peel') || lower.includes('acne')) entities.serviceName = 'Salicylic & Mandelic Chemical Peel';
  else if (lower.includes('botox')) entities.serviceName = 'Botox Anti-Wrinkle Smoothing';

  if (lower.includes('priya')) entities.doctorName = 'Dr. Priya Sharma';
  else if (lower.includes('rohan')) entities.doctorName = 'Dr. Rohan Mehta';

  if (lower.includes('tomorrow')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    entities.date = d.toISOString().split('T')[0];
  } else if (lower.includes('today')) {
    entities.date = new Date().toISOString().split('T')[0];
  }

  const timeMatch = lower.match(/\b([01]?\d|2[0-3])(?::([0-5]\d))?\s*(am|pm)?\b/);
  if (timeMatch && (lower.includes('am') || lower.includes('pm') || lower.includes(':'))) {
    entities.time = timeMatch[0];
  }

  return entities;
}
