export type AppointmentStatus = 
  | 'PENDING_PAYMENT'
  | 'BOOKED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface TimeSlot {
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "10:30"
  available: boolean;
  reason?: string;   // e.g. "Booked", "Doctor on Break", "Outside Shift"
}

export interface Appointment {
  id: string;
  clinicId: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  consultationFee: number;
  depositPaid: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  paymentId?: string;
  status: AppointmentStatus;
  notes?: string;
  bookedVia: 'WHATSAPP_AI' | 'DASHBOARD_STAFF' | 'WEBSITE';
  cancellationReason?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityQuery {
  date: string; // YYYY-MM-DD
  doctorId?: string;
  serviceId?: string;
}

export interface DayAvailability {
  date: string;
  doctorId: string;
  doctorName: string;
  slots: TimeSlot[];
}
