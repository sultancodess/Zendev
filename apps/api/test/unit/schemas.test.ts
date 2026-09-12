import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  createDoctorSchema,
  createServiceSchema,
  createLeadSchema,
  createAppointmentSchema,
  createFaqSchema,
  createKnowledgeDocSchema,
  loginSchema,
  sendStaffMessageSchema,
} from '@dermo/schemas';

describe('Unit Tests: Zod Schemas Validation', () => {
  it('should validate valid doctor schema', () => {
    const validDoctor = {
      name: 'Dr. Priya Sharma',
      title: 'Senior Aesthetic Dermatologist',
      qualification: 'MBBS, MD (Dermatology)',
      experienceYears: 12,
      specialty: ['Medical Dermatology', 'Aesthetic Lasers'],
      consultationFee: 1000,
      avatarUrl: 'https://example.com/priya.jpg',
      bio: 'Dr. Priya Sharma is a board-certified dermatologist with over 12 years of clinical experience.',
      schedule: [
        {
          day: 'monday',
          isWorking: true,
          startTime: '09:00',
          endTime: '17:00',
          breakStart: '13:00',
          breakEnd: '14:00',
          slotDurationMinutes: 30,
        },
      ],
      status: 'ACTIVE',
    };

    const result = createDoctorSchema.safeParse(validDoctor);
    assert.strictEqual(result.success, true);
  });

  it('should reject doctor schema with missing required fields', () => {
    const invalidDoctor = {
      name: 'Dr. Test',
      // missing qualification, bio, fee, etc.
    };

    const result = createDoctorSchema.safeParse(invalidDoctor);
    assert.strictEqual(result.success, false);
  });

  it('should validate valid service schema', () => {
    const validService = {
      name: 'HydraFacial MD Elite Glow',
      category: 'FACIAL_AESTHETICS',
      description: 'Deep cleansing, gentle exfoliation, and intense hydration facial treatment.',
      benefits: ['Instant Glow', 'Zero Downtime', 'Deep Cleansing'],
      durationMinutes: 45,
      price: 3500,
      depositRequired: true,
      depositAmount: 500,
      bookingEnabled: true,
      status: 'ACTIVE',
    };

    const result = createServiceSchema.safeParse(validService);
    assert.strictEqual(result.success, true);
  });

  it('should validate valid appointment schema', () => {
    const validAppointment = {
      leadId: 'lead_123',
      doctorId: 'doc_123',
      serviceId: 'srv_123',
      date: '2026-09-15',
      startTime: '10:00',
      notes: 'First time consultation',
    };

    const result = createAppointmentSchema.safeParse(validAppointment);
    assert.strictEqual(result.success, true);
  });

  it('should validate valid lead schema', () => {
    const validLead = {
      name: 'Ananya Roy',
      phone: '+919876543210',
      email: 'ananya@example.com',
      source: 'WHATSAPP',
      status: 'NEW',
    };

    const result = createLeadSchema.safeParse(validLead);
    assert.strictEqual(result.success, true);
  });

  it('should validate knowledge doc creation schema', () => {
    const validDoc = {
      title: 'Post-Laser Aftercare Protocol',
      category: 'AFTERCARE',
      content: 'Avoid direct sunlight for 48 hours following laser treatment.',
    };

    const result = createKnowledgeDocSchema.safeParse(validDoc);
    assert.strictEqual(result.success, true);
  });

  it('should validate staff manual message schema', () => {
    const validMessage = {
      content: 'Hello! I am Sneha from the reception desk.',
      mediaUrl: 'https://example.com/brochure.pdf',
    };

    const result = sendStaffMessageSchema.safeParse(validMessage);
    assert.strictEqual(result.success, true);
  });

  it('should validate auth login schema', () => {
    const validLogin = {
      email: 'admin@dermacare.com',
      password: 'password123',
    };

    const result = loginSchema.safeParse(validLogin);
    assert.strictEqual(result.success, true);
  });
});
