export interface DoctorShift {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "18:00"
  slotDurationMinutes: number; // e.g. 30
  breakStart?: string; // e.g. "13:00"
  breakEnd?: string;   // e.g. "14:00"
  isWorking: boolean;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  title: string; // e.g. "Senior Consultant Dermatologist"
  qualification: string; // e.g. "MBBS, MD (Dermatology, Venereology & Leprosy)"
  specialty: string[]; // e.g. ["Acne & Scar Treatments", "Anti-Aging & Botox", "Laser Hair Reduction"]
  experienceYears: number;
  consultationFee: number;
  avatarUrl?: string;
  bio: string;
  schedule: DoctorShift[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
