export type ConversationMode = 'AI' | 'HUMAN_TAKEOVER';

export type ConversationState = 
  | 'START'
  | 'INFORMATION'
  | 'QUALIFICATION'
  | 'BOOKING'
  | 'CONFIRMATION'
  | 'COMPLETED'
  | 'HANDOFF'
  | 'CANCELLED';

export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageSender = 'PATIENT' | 'AI' | 'STAFF' | 'SYSTEM';

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  providerMessageId?: string; // Meta WhatsApp message id for deduplication
  direction: MessageDirection;
  sender: MessageSender;
  senderName?: string;
  content: string;
  mediaUrl?: string;
  interactiveType?: 'quick_reply' | 'button' | 'list' | 'template';
  interactiveOptions?: Array<{ id: string; title: string }>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  rawPayload?: any;
  createdAt: string;
}

export interface Conversation {
  id: string;
  clinicId: string;
  leadId: string;
  patientPhone: string;
  patientName: string;
  state: ConversationState;
  mode: ConversationMode;
  assignedStaffId?: string;
  lastIntent?: string;
  bookingDraft?: {
    serviceId?: string;
    doctorId?: string;
    date?: string;
    slot?: string;
  };
  unreadCount: number;
  lastMessageAt: string;
  lastMessagePreview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Handoff {
  id: string;
  conversationId: string;
  clinicId: string;
  leadId: string;
  reason: 'MEDICAL_SAFETY' | 'STAFF_REQUEST' | 'EMERGENCY_SIGNAL' | 'UNRESOLVED_QUERY' | 'PAYMENT_HELP';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
  resolvedAt?: string;
}
