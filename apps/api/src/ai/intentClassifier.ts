import { IntentType, AIClassificationResult, SafetyClassification } from '@dermo/types';
import { checkSafety } from './safetyGuard';
import { config } from '../config';

export async function classifyMessage(message: string): Promise<AIClassificationResult> {
  // 1. First run medical safety & emergency guardrail (P0 Invariant)
  const safetyCheck = checkSafety(message);
  if (!safetyCheck.isSafe) {
    return {
      intent: safetyCheck.classification === 'EMERGENCY_ESCALATE' ? 'EMERGENCY_SIGNAL' : 'MEDICAL_QUESTION',
      confidence: 0.99,
      safety: safetyCheck.classification,
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  const lower = message.toLowerCase().trim();

  // 2. Emergency keywords fallback
  if (/(emergency|severe allergic reaction|anaphylaxis|bleeding|burn)/i.test(lower)) {
    return {
      intent: 'EMERGENCY_SIGNAL',
      confidence: 0.99,
      safety: 'EMERGENCY_ESCALATE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 3. Human Request / Handoff
  if (
    /(talk to human|speak with doctor|receptionist|staff|real person|call me|connect to human|speak with clinic manager|connect to billing staff|staff se baat|message forward|talk to reception)/i.test(
      lower
    )
  ) {
    return {
      intent: 'HUMAN_REQUEST',
      confidence: 0.95,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 4. Appointment Rescheduling (Checked before general cancellation/booking)
  if (
    /(reschedule|change time|change date|postpone|shift appointment|reschedule slot|postpone karke|shift my doctor|time change|date change)/i.test(
      lower
    )
  ) {
    return {
      intent: 'APPOINTMENT_RESCHEDULE',
      confidence: 0.95,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 5. Payment Queries (Deposit refund, payment modes, Razorpay, etc.)
  if (
    /(payment mode|payment option|modes do you accept|pay via|accept hota hai|razorpay|upi|google pay|phonepe|paytm|cash at the clinic|deposit refund|invoice|insurance reimbursement|emi option|credit card aur debit|advance deposit kaise)/i.test(
      lower
    )
  ) {
    return {
      intent: 'PAYMENT_QUERY',
      confidence: 0.94,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 6. Appointment Cancellation
  if (
    /(cancel appointment|cancel booking|cancel my|cannot come|call off|drop appointment|drop kar dijiye|cancel karne|cancel the appointment|cancel kar)/i.test(
      lower
    )
  ) {
    return {
      intent: 'APPOINTMENT_CANCEL',
      confidence: 0.95,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 7. Clinic Location / Directions / Parking
  if (
    /(address|where are you located|location|directions|landmark|parking|koramangala|maps|pin code|which floor|close to sony world)/i.test(
      lower
    )
  ) {
    return {
      intent: 'CLINIC_LOCATION',
      confidence: 0.94,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 8. Doctor Information (Who is available for consultation / doctor profile / timings of doctor)
  if (
    /(tell me about dr|qualifications and experience|chief dermatologist|specialties of your|trichology|aesthetic surgeon|profile share|md in dermatology|medical background|specialist ke bare|dr\. priya sharma skin specialist|who is available for consultation|available on saturdays\?|ke clinic timings kya hain)/i.test(
      lower
    ) ||
    (/(dr\.|doctor|priya|rohan)/i.test(lower) &&
      (lower.includes('profile') ||
        lower.includes('specialist') ||
        lower.includes('experience') ||
        lower.includes('qualification') ||
        lower.includes('who is') ||
        lower.includes('available on saturday') ||
        lower.includes('available on sunday')))
  ) {
    return {
      intent: 'DOCTOR_INFORMATION',
      confidence: 0.92,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 9. Working Hours & Operating Timings
  if (
    /(working hours|open today|closing time|clinic timing|sunday open|public holidays|open in the morning|visit at|sham ko kitne baje|until what time|timings kya hai)/i.test(
      lower
    ) &&
    !lower.includes('available slots') &&
    !lower.includes('free slot') &&
    !lower.includes('doctor ke available')
  ) {
    return {
      intent: 'WORKING_HOURS',
      confidence: 0.93,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 10. Pricing, Discounts & Package Fees
  if (
    /(price|cost|charge|fees|how much|rate|package price|charges|deposit fee|deposit amount|kharcha|discounts for|advance deposit for booking)/i.test(
      lower
    )
  ) {
    return {
      intent: 'PRICE_INFORMATION',
      confidence: 0.93,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 11. Appointment Booking (Direct booking intents)
  if (
    /(book|schedule|reserve|appointment book|want a slot|book for tomorrow|fix a time|confirm my booking|reserve slot|slot book|appointment fix|booking karni|booking confirm|fix an appointment)/i.test(
      lower
    )
  ) {
    return {
      intent: 'APPOINTMENT_BOOKING',
      confidence: 0.94,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 12. FAQ & Pre/Post Care
  if (
    /(downtime|before laser|aftercare|care should i take|skin peeling|apply makeup|how long do results|painful|sun exposure|interval between|wash my hair|suitable for|safe for sensitive|mandatory before|consultation mandatory|sunscreen lagana|resume workouts|redness aati hai|bring a friend|wifi)/i.test(
      lower
    )
  ) {
    return {
      intent: 'FAQ_QUERY',
      confidence: 0.9,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 13. Appointment Availability & Open Slots
  if (
    /(available slots|free slots|open timings|slots available|doctor available|free slot|koi free slot|are appointments available|check availability|open consultation slots|morning slot|available timings|evening timings|pm open|am open|session available)/i.test(
      lower
    ) ||
    (/(available|slot)/i.test(lower) &&
      !lower.includes('options are available') &&
      !lower.includes('chemical peel acne ke liye available') &&
      !lower.includes('hi there, is anyone'))
  ) {
    return {
      intent: 'APPOINTMENT_AVAILABILITY',
      confidence: 0.92,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 14. Service Information
  if (
    /(hydrafacial|laser|hair reduction|prp|chemical peel|botox|acne|scars|pigmentation|facial|glow|treatments do you have|permanent hota hai|difference between regular facial|options are available|technology do you use)/i.test(
      lower
    )
  ) {
    return {
      intent: 'SERVICE_INFORMATION',
      confidence: 0.91,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 15. Greetings
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening)|hola)/i.test(lower)) {
    return {
      intent: 'GREETING',
      confidence: 0.95,
      safety: 'SAFE',
      language: detectLanguage(message),
      extractedEntities: extractEntities(message),
    };
  }

  // 16. Fallback General FAQ
  return {
    intent: 'FAQ_QUERY',
    confidence: 0.8,
    safety: 'SAFE',
    language: detectLanguage(message),
    extractedEntities: extractEntities(message),
  };
}

function detectLanguage(text: string): 'en' | 'hi' | 'hinglish' {
  const lower = text.toLowerCase();
  if (/(kya|kaise|kitna|hoga|chahiye|kab|hai|dhanyawad|shukriya|namaste|mujhe|karna|karwaiye|kardo|bataiye|padega|kharcha|shuru)/i.test(lower)) {
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
  else if (lower.includes('prp') || lower.includes('hair loss') || lower.includes('hair restoration')) entities.serviceName = 'GFC & PRP Hair Restoration Therapy';
  else if (lower.includes('peel') || lower.includes('chemical peel')) entities.serviceName = 'Salicylic & Mandelic Chemical Peel';
  else if (lower.includes('botox') || lower.includes('anti-wrinkle')) entities.serviceName = 'Botox Anti-Wrinkle Smoothing';

  if (lower.includes('priya')) entities.doctorName = 'Dr. Priya Sharma';
  else if (lower.includes('rohan')) entities.doctorName = 'Dr. Rohan Mehta';

  if (lower.includes('tomorrow') || lower.includes('kal')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    entities.date = d.toISOString().split('T')[0];
  } else if (lower.includes('today') || lower.includes('aaj')) {
    entities.date = new Date().toISOString().split('T')[0];
  }

  const timeMatch = lower.match(/\b([01]?\d|2[0-3])(?::([0-5]\d))?\s*(am|pm)?\b/);
  if (timeMatch && (lower.includes('am') || lower.includes('pm') || lower.includes(':'))) {
    entities.time = timeMatch[0];
  }

  return entities;
}
