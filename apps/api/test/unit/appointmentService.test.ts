import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db } from '../../src/database/db.js';
import { seedDatabase } from '../../src/database/seed.js';
import { appointmentService } from '../../src/services/appointmentService.js';
import { leadService } from '../../src/services/leadService.js';

describe('Unit Tests: Appointment Scheduling & Conflict Prevention', () => {
  beforeEach(() => {
    seedDatabase();
  });

  it('should compute available slots for a doctor on a working day', () => {
    const doctor = db.getDoctors()[0];
    // 2026-09-14 is a Monday (doctor works 10:00 - 18:00, break 13:00 - 14:00)
    const availability = appointmentService.getAvailability({ doctorId: doctor.id, date: '2026-09-14' });
    assert(Array.isArray(availability.slots));
    assert(availability.slots.length > 0);
    assert(availability.slots.some((s) => s.startTime === '10:00'));
    // Break is 13:00 - 14:00, so 13:00 should be unavailable
    const breakSlot = availability.slots.find((s) => s.startTime === '13:00');
    assert(breakSlot !== undefined);
    assert.strictEqual(breakSlot?.available, false);
  });

  it('should book an appointment atomically and mark slot as reserved', () => {
    const doctor = db.getDoctors()[0];
    const service = db.getServices()[0];
    const lead = leadService.getOrCreateLead({ phone: '+919876543210', name: 'Rahul Sharma' });

    const appointment = appointmentService.createAppointment({
      leadId: lead.id,
      doctorId: doctor.id,
      serviceId: service.id,
      date: '2026-09-14',
      startTime: '10:00',
    });

    assert.strictEqual(appointment.status, 'BOOKED');
    assert.strictEqual(appointment.startTime, '10:00');
    assert.strictEqual(appointment.date, '2026-09-14');

    // Slot at 10:00 should now be unavailable
    const availability = appointmentService.getAvailability({ doctorId: doctor.id, date: '2026-09-14' });
    const bookedSlot = availability.slots.find((s) => s.startTime === '10:00');
    assert.strictEqual(bookedSlot?.available, false);
  });

  it('should reject double-booking the same slot for the same doctor', () => {
    const doctor = db.getDoctors()[0];
    const service = db.getServices()[0];
    const lead1 = leadService.getOrCreateLead({ phone: '+919876543211', name: 'Ananya Roy' });
    const lead2 = leadService.getOrCreateLead({ phone: '+919876543212', name: 'Pooja Verma' });

    appointmentService.createAppointment({
      leadId: lead1.id,
      doctorId: doctor.id,
      serviceId: service.id,
      date: '2026-09-14',
      startTime: '11:00',
    });

    assert.throws(
      () => {
        appointmentService.createAppointment({
          leadId: lead2.id,
          doctorId: doctor.id,
          serviceId: service.id,
          date: '2026-09-14',
          startTime: '11:00',
        });
      },
      /The selected appointment slot is no longer available/
    );
  });

  it('should reschedule an appointment to a new available time', () => {
    const doctor = db.getDoctors()[0];
    const service = db.getServices()[0];
    const lead = leadService.getOrCreateLead({ phone: '+919876543213', name: 'Vikram Malhotra' });

    const appt = appointmentService.createAppointment({
      leadId: lead.id,
      doctorId: doctor.id,
      serviceId: service.id,
      date: '2026-09-14',
      startTime: '14:00',
    });

    const rescheduled = appointmentService.rescheduleAppointment(
      appt.id,
      '2026-09-14',
      '14:30',
      'Patient requested new slot'
    );
    assert.strictEqual(rescheduled.startTime, '14:30');
    assert.strictEqual(rescheduled.status, 'RESCHEDULED');

    // 14:00 should now be available again
    const availability = appointmentService.getAvailability({ doctorId: doctor.id, date: '2026-09-14' });
    const oldSlot = availability.slots.find((s) => s.startTime === '14:00');
    assert.strictEqual(oldSlot?.available, true);
  });

  it('should cancel an appointment and release the slot', () => {
    const doctor = db.getDoctors()[0];
    const service = db.getServices()[0];
    const lead = leadService.getOrCreateLead({ phone: '+919876543214', name: 'Simran Kaur' });

    const appt = appointmentService.createAppointment({
      leadId: lead.id,
      doctorId: doctor.id,
      serviceId: service.id,
      date: '2026-09-14',
      startTime: '15:00',
    });

    const cancelled = appointmentService.cancelAppointment(appt.id, 'Patient requested');
    assert.strictEqual(cancelled.status, 'CANCELLED');

    const availability = appointmentService.getAvailability({ doctorId: doctor.id, date: '2026-09-14' });
    const releasedSlot = availability.slots.find((s) => s.startTime === '15:00');
    assert.strictEqual(releasedSlot?.available, true);
  });
});
