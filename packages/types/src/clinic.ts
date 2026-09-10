export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;  // e.g. "09:00"
  close: string; // e.g. "19:00"
  isOpen: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  timezone: string;
  currency: string;
  hours: WorkingHours[];
  enableGoogleDocsSync?: boolean;
  enableRazorpayDeposits?: boolean;
  consultationDepositAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'DOCTOR';

export interface StaffUser {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}
