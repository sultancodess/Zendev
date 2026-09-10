export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    requestId?: string;
  };
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export interface AuditLog {
  id: string;
  clinicId: string;
  userId?: string;
  userName?: string;
  action: string; // e.g. "STAFF_INVITE", "KNOWLEDGE_APPROVED", "APPOINTMENT_CANCELLED", "TAKEOVER_START"
  entityType: 'APPOINTMENT' | 'LEAD' | 'CONVERSATION' | 'KNOWLEDGE' | 'DOCTOR' | 'SERVICE' | 'CLINIC' | 'PAYMENT';
  entityId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalEnquiries: number;
  qualifiedLeads: number;
  appointmentsBooked: number;
  appointmentsCompleted: number;
  cancelledAppointments: number;
  noShows: number;
  humanHandoffs: number;
  totalRevenue: number;
  aiConversionRate: number; // e.g. 34.2 (%)
  aiAccuracyScore: number;  // e.g. 98.6 (%)
}
