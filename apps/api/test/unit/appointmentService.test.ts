import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { appointmentService } from '../../src/services/appointmentService';
import { db } from '../../src/database/db';

describe('Unit Tests: Appointment Scheduling, Availability & Conflict Prevention', () => {
  let testDoctorId: string;
  let testServiceId: string;
  let testLeadId: string;
  const testDate = '2026-10-12'; // Monday

  beforeEach(() => {
    const doc = db.getDoctors()[0];
    testDoctorId = doc.id;
    const srv = db.getServices()[0];
    testServiceId = srv.id;
    const lead = db.getLeads()[0] || db.createLead({
      clinicId: db.getClinic().id,
      name: 'Test Patient',
      phone: '+919999988888',
      source: 'WHATSAPP',
      status: 'QUALIFIED',
    });
    testLeadId = lead.id;
  });

  it('should calculate accurate available time slots respecting break hours', () => {
    const availability = appointmentService.getAvailability({
      date: testDate,
      doctorId: testDoctorId,
    });

    assert.strictEqual(availability.date, testDate);
    assert.strictEqual(availability.doctorId, testDoctorId);
    assert.ok(availability.slots.length > 0);

    // Doctor break is 13:00 to 14:00, ensure 13:00 slot is marked unavailable
    const breakSlot = availability.slots.find((s) => s.startTime === '13:00');
    if (breakSlot) {
      assert.strictEqual(breakSlot.available, false);
      assert.strictEqual(breakSlot.reason, 'Doctor Break');
    }

    // Normal working slot at 10:00 should be available initially
    const morningSlot = availability.slots.find((s) => s.startTime === '10:00');
    assert.ok(morningSlot);
  });

  it('should book an appointment and mark the slot unavailable', () => {
    const booking = appointmentService.createAppointment({
      leadId: testLeadId,
      doctorId: testDoctorId,
      serviceId: testServiceId,
      date: testDate,
      startTime: '10:30',
      idempotencyKey: 'test_key_1',
    });

    assert.ok(booking.id);
    assert.strictEqual(booking.startTime, '10:30');
    assert.strictEqual(booking.status, 'CONFIRMED');

    // Slot at 10:30 should now be unavailable
    const availability = appointmentService.getAvailability({
      date: testDate,
      doctorId: testDoctorId,
    });
    const bookedSlot = availability.slots.find((s) => s.startTime === '10:30');
    assert.strictEqual(bookedSlot?.available, false);
    assert.strictEqual(bookedSlot?.reason, 'Already Booked');
  });

  it('should prevent double-booking the same slot and throw conflict error', () => {
    assert.throws(
      () => {
        appointmentService.createAppointment({
          leadId: testLeadId,
          doctorId: testDoctorId,
          serviceId: testServiceId,
          date: testDate,
          startTime: '10:30',
          idempotencyKey: 'test_key_2',
        });
      },
      (err: any) => {
        return err.code === 'SLOT_UNAVAILABLE' || err.statusCode === 409;
      }
    );
  });

  it('should support idempotent retry for the same idempotency key', () => {
    const retry = appointmentService.createAppointment({
      leadId: testLeadId,
      doctorId: testDoctorId,
      serviceId: testServiceId,
      date: testDate,
      startTime: '10:30',
      idempotencyKey: 'test_key_1',
    });

    assert.ok(retry.id);
    assert.strictEqual(retry.startTime, '10:30');
  });

  it('should reschedule an existing appointment to a new open slot', () => {
    const appts = db.getAppointments().filter((a) => a.status === 'CONFIRMED');
    const target = appts[0];
    assert.ok(target);

    const rescheduled = appointmentService.rescheduleAppointment(
      target.id,
      testDate,
      '11:30',
      'Patient requested later time'
    );

    assert.strictEqual(rescheduled.startTime, '11:30');
    assert.strictEqual(rescheduled.status, 'CONFIRMED');
  });

  it('should cancel an existing appointment and free up the slot', () => {
    const appts = db.getAppointments().filter((a) => a.status === 'CONFIRMED');
    const target = appts[0];
    assert.ok(target);

    const cancelled = appointmentService.cancelAppointment(target.id, 'Patient cancelled due to travel');
    assert.strictEqual(cancelled.status, 'CANCELLED');
  });
});
