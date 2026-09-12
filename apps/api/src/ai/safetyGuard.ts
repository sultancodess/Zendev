import { SafetyClassification } from '@dermo/types';

export interface SafetyCheckResult {
  classification: SafetyClassification;
  isSafe: boolean;
  reason?: string;
  suggestedResponse?: string;
}

// Medical non-diagnostic guardrail terms
const MEDICATION_TERMS = [
  'isotretinoin', 'accutane', 'tretinoin', 'antibiotic', 'steroid', 'prednisone',
  'minoxidil', 'finasteride', 'hydroquinone', 'doxycycline', 'clindamycin',
  'prescription', 'dosage', 'tablet', 'cream recommendation'
];

const EMERGENCY_TERMS = [
  'severe allergic reaction', 'anaphylaxis', 'bleeding heavily', 'chemical burn on eyes',
  'throat closing', 'difficulty breathing', 'extreme swelling', 'emergency'
];

const DIAGNOSTIC_SYMPTOMS = [
  'is this skin cancer', 'melanoma', 'mole changing color', 'bleeding mole',
  'severe infection', 'pus discharge', 'fungal diagnosis', 'fungal infection',
  'diagnose if', 'diagnose whether', 'skin disease diagnosis'
];

export function checkSafety(message: string): SafetyCheckResult {
  const lower = message.toLowerCase();

  // 1. Emergency Escalation
  for (const term of EMERGENCY_TERMS) {
    if (lower.includes(term)) {
      return {
        classification: 'EMERGENCY_ESCALATE',
        isSafe: false,
        reason: `Emergency signal detected: "${term}"`,
        suggestedResponse: `🚨 **Urgent Notice**: If you are experiencing a severe medical emergency or acute allergic reaction, please visit the nearest hospital emergency room immediately. We have alerted our clinic medical team to contact you urgently.`,
      };
    }
  }

  // 2. Medication / Prescription Inquiries (Strict Non-Diagnostic Policy)
  for (const term of MEDICATION_TERMS) {
    if (lower.includes(term)) {
      return {
        classification: 'MEDICAL_NON_DIAGNOSTIC',
        isSafe: false,
        reason: `Medication or prescription advice inquiry detected: "${term}"`,
        suggestedResponse: `⚠️ Medical prescription advice cannot be provided over automated chat. Prescription drugs such as ${term} require a personalized clinical evaluation by Dr. Priya Sharma or Dr. Rohan Mehta. Would you like me to schedule an in-clinic consultation for you?`,
      };
    }
  }

  // 3. Complex Diagnostic Question
  for (const term of DIAGNOSTIC_SYMPTOMS) {
    if (lower.includes(term)) {
      return {
        classification: 'MEDICAL_NON_DIAGNOSTIC',
        isSafe: false,
        reason: `Diagnostic assessment inquiry detected: "${term}"`,
        suggestedResponse: `A physical examination using dermatoscopy is essential for accurate clinical evaluation of skin lesions. Our senior dermatologists can assess this during a consultation. Would you like to check doctor availability?`,
      };
    }
  }

  return {
    classification: 'SAFE',
    isSafe: true,
  };
}
