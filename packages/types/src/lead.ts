export type LeadStatus = 
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'APPOINTMENT_BOOKED'
  | 'CONVERTED'
  | 'LOST';

export type LeadSource = 'WHATSAPP' | 'WEBSITE' | 'WALK_IN' | 'INSTAGRAM' | 'REFERRAL';

export interface Lead {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  primaryConcern?: string; // e.g. "Acne scars on cheeks"
  interestedServiceId?: string;
  preferredDoctorId?: string;
  budgetEstimated?: number;
  tags: string[];
  notes?: string;
  assignedStaffId?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}
