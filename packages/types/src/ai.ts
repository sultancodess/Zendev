export type IntentType = 
  | 'GREETING'
  | 'SERVICE_INFORMATION'
  | 'PRICE_INFORMATION'
  | 'DOCTOR_INFORMATION'
  | 'WORKING_HOURS'
  | 'CLINIC_LOCATION'
  | 'APPOINTMENT_AVAILABILITY'
  | 'APPOINTMENT_BOOKING'
  | 'APPOINTMENT_RESCHEDULE'
  | 'APPOINTMENT_CANCEL'
  | 'MEDICAL_QUESTION'
  | 'EMERGENCY_SIGNAL'
  | 'HUMAN_REQUEST'
  | 'PAYMENT_QUERY'
  | 'FAQ_QUERY'
  | 'UNKNOWN';

export type SafetyClassification = 'SAFE' | 'MEDICAL_NON_DIAGNOSTIC' | 'EMERGENCY_ESCALATE' | 'RESTRICTED';

export interface AIClassificationResult {
  intent: IntentType;
  confidence: number;
  safety: SafetyClassification;
  language: 'en' | 'hi' | 'hinglish';
  extractedEntities: {
    serviceName?: string;
    doctorName?: string;
    date?: string;
    time?: string;
    symptoms?: string[];
    patientName?: string;
  };
}

export interface GroundedAIResponse {
  replyText: string;
  suggestedQuickReplies?: string[];
  toolExecuted?: string;
  toolResult?: any;
  needsHandoff: boolean;
  handoffReason?: string;
  updatedState?: string;
  ragSourcesUsed?: string[];
}
