export type ServiceCategory = 
  | 'FACIAL_AESTHETICS'
  | 'LASER_TREATMENTS'
  | 'HAIR_RESTORATION'
  | 'ANTI_AGING'
  | 'CLINICAL_DERMATOLOGY'
  | 'BODY_CONTOURING';

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  category: ServiceCategory;
  description: string;
  benefits: string[];
  price: number;
  durationMinutes: number;
  depositRequired: boolean;
  depositAmount?: number;
  bookingEnabled: boolean;
  requiresConsultationFirst: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
