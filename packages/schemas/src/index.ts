import { z } from 'zod';

// ==========================================
// Authentication Schemas
// ==========================================
export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ==========================================
// Clinic Schemas
// ==========================================
export const workingHoursSchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm'),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm'),
  isOpen: z.boolean(),
});

export const updateClinicSchema = z.object({
  name: z.string().min(2).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  hours: z.array(workingHoursSchema).optional(),
  enableGoogleDocsSync: z.boolean().optional(),
  enableRazorpayDeposits: z.boolean().optional(),
  consultationDepositAmount: z.number().min(0).optional(),
});

// ==========================================
// Doctor Schemas
// ==========================================
export const doctorShiftSchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  slotDurationMinutes: z.number().min(15).max(120).default(30),
  breakStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  breakEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  isWorking: z.boolean(),
});

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Doctor name is required'),
  title: z.string().min(2, 'Professional title is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  specialty: z.array(z.string()).min(1, 'At least one specialty is required'),
  experienceYears: z.number().min(0),
  consultationFee: z.number().min(0),
  avatarUrl: z.string().url().optional(),
  bio: z.string().min(10, 'Bio is required'),
  schedule: z.array(doctorShiftSchema).optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateDoctorSchema = createDoctorSchema.partial();

// ==========================================
// Service Schemas
// ==========================================
export const createServiceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  category: z.enum([
    'FACIAL_AESTHETICS',
    'LASER_TREATMENTS',
    'HAIR_RESTORATION',
    'ANTI_AGING',
    'CLINICAL_DERMATOLOGY',
    'BODY_CONTOURING',
  ]),
  description: z.string().min(10, 'Description is required'),
  benefits: z.array(z.string()).default([]),
  price: z.number().min(0, 'Price must be non-negative'),
  durationMinutes: z.number().min(15).max(300).default(45),
  depositRequired: z.boolean().default(false),
  depositAmount: z.number().min(0).optional(),
  bookingEnabled: z.boolean().default(true),
  requiresConsultationFirst: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateServiceSchema = createServiceSchema.partial();

// ==========================================
// Lead Schemas
// ==========================================
export const createLeadSchema = z.object({
  name: z.string().min(2, 'Lead name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional(),
  source: z.enum(['WHATSAPP', 'WEBSITE', 'WALK_IN', 'INSTAGRAM', 'REFERRAL']).default('WHATSAPP'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'APPOINTMENT_BOOKED', 'CONVERTED', 'LOST']).default('NEW'),
  primaryConcern: z.string().optional(),
  interestedServiceId: z.string().optional(),
  preferredDoctorId: z.string().optional(),
  budgetEstimated: z.number().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  assignedStaffId: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

// ==========================================
// Appointment Schemas
// ==========================================
export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  doctorId: z.string().optional(),
  serviceId: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be HH:mm'),
  notes: z.string().optional(),
  bookedVia: z.enum(['WHATSAPP_AI', 'DASHBOARD_STAFF', 'WEBSITE']).default('WHATSAPP_AI'),
  idempotencyKey: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be HH:mm'),
  reason: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason is required'),
});

// ==========================================
// Knowledge & FAQ Schemas
// ==========================================
export const createFaqSchema = z.object({
  question: z.string().min(5, 'Question is required'),
  answer: z.string().min(10, 'Answer is required'),
  category: z.string().min(2).default('GENERAL'),
  isApproved: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial();

export const createKnowledgeDocSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  category: z.enum(['SERVICES', 'POLICIES', 'AFTERCARE', 'PRICING', 'DOCTORS', 'GENERAL']),
  content: z.string().min(20, 'Document content must be at least 20 characters'),
});

// ==========================================
// WhatsApp & Conversation Schemas
// ==========================================
export const sendStaffMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
  mediaUrl: z.string().url().optional(),
});

export const simulatorMessageSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  name: z.string().optional().default('Patient User'),
  message: z.string().min(1, 'Message is required'),
});

// ==========================================
// Razorpay Payment Schemas
// ==========================================
export const createPaymentOrderSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  appointmentId: z.string().optional(),
  amount: z.number().min(100, 'Minimum amount is ₹1 (100 paise)'),
  currency: z.string().default('INR'),
  description: z.string().default('Clinic Appointment Booking Deposit'),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
