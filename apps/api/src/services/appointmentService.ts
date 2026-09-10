import { db } from '../database/db';
import { Appointment, DayAvailability, TimeSlot } from '@dermo/types';
import { AppError } from '../middleware/errorHandler';

export class AppointmentService {
  private static instance: AppointmentService;

  private constructor() {}

  public static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService();
    }
    return AppointmentService.instance;
  }

  // Calculate doctor availability for a given date
  getAvailability(params: { date: string; doctorId?: string; serviceId?: string }): DayAvailability {
    const { date, doctorId } = params;
    const doctors = db.getDoctors();
    const targetDoctor = doctorId ? db.getDoctorById(doctorId) : doctors[0];

    if (!targetDoctor) {
      throw new AppError('Doctor not found', 404, 'NOT_FOUND');
    }

    // Determine day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as any;
    const shift = targetDoctor.schedule.find((s) => s.day === dayOfWeek);

    if (!shift || !shift.isWorking) {
      return {
        date,
        doctorId: targetDoctor.id,
        doctorName: targetDoctor.name,
        slots: [],
      };
    }

    // Generate slots
    const slots: TimeSlot[] = [];
    const [startH, startM] = shift.startTime.split(':').map(Number);
    const [endH, endM] = shift.endTime.split(':').map(Number);
    const duration = shift.slotDurationMinutes || 30;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    let breakStartMin = 0;
    let breakEndMin = 0;
    if (shift.breakStart && shift.breakEnd) {
      const [bsh, bsm] = shift.breakStart.split(':').map(Number);
      const [beh, bem] = shift.breakEnd.split(':').map(Number);
      breakStartMin = bsh * 60 + bsm;
      breakEndMin = beh * 60 + bem;
    }

    const existingAppointments = db.getAppointmentsByDoctorAndDate(targetDoctor.id, date);

    while (currentMinutes + duration <= endMinutes) {
      const slotStartH = Math.floor(currentMinutes / 60);
      const slotStartM = currentMinutes % 60;
      const slotEndMinutes = currentMinutes + duration;
      const slotEndH = Math.floor(slotEndMinutes / 60);
      const slotEndM = slotEndMinutes % 60;

      const startTimeStr = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;
      const endTimeStr = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`;

      // Check if slot falls in break
      const isBreak = breakStartMin > 0 && currentMinutes >= breakStartMin && currentMinutes < breakEndMin;

      // Check if already booked
      const isBooked = existingAppointments.some(
        (a) => a.startTime === startTimeStr && a.status !== 'CANCELLED'
      );

      slots.push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        available: !isBreak && !isBooked,
        reason: isBreak ? 'Doctor Break' : isBooked ? 'Already Booked' : undefined,
      });

      currentMinutes += duration;
    }

    return {
      date,
      doctorId: targetDoctor.id,
      doctorName: targetDoctor.name,
      slots,
    };
  }

  // Atomic Appointment Booking with Slot Conflict Prevention
  createAppointment(params: {
    leadId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    notes?: string;
    bookedVia?: 'WHATSAPP_AI' | 'DASHBOARD_STAFF' | 'WEBSITE';
    idempotencyKey?: string;
  }): Appointment {
    const { leadId, doctorId, serviceId, date, startTime, notes, bookedVia = 'WHATSAPP_AI', idempotencyKey } = params;

    // Idempotency check
    if (idempotencyKey) {
      const existing = db.getAppointments().find((a) => a.idempotencyKey === idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const lead = db.getLeadById(leadId);
    if (!lead) throw new AppError('Lead not found', 404, 'NOT_FOUND');

    const doctor = db.getDoctorById(doctorId);
    if (!doctor) throw new AppError('Doctor not found', 404, 'NOT_FOUND');

    const service = db.getServiceById(serviceId);
    if (!service) throw new AppError('Service not found', 404, 'NOT_FOUND');

    // Conflict Check
    const availability = this.getAvailability({ date, doctorId });
    const matchingSlot = availability.slots.find((s) => s.startTime === startTime);

    if (!matchingSlot || !matchingSlot.available) {
      throw new AppError(
        'The selected appointment slot is no longer available.',
        409,
        'SLOT_UNAVAILABLE'
      );
    }

    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + service.durationMinutes;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const appointment = db.createAppointment({
      clinicId: db.getClinic().id,
      leadId: lead.id,
      leadName: lead.name,
      leadPhone: lead.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      serviceId: service.id,
      serviceName: service.name,
      date,
      startTime,
      endTime,
      durationMinutes: service.durationMinutes,
      consultationFee: doctor.consultationFee,
      depositPaid: service.depositRequired ? (service.depositAmount || 500) : 0,
      paymentStatus: service.depositRequired ? 'PARTIALLY_PAID' : 'UNPAID',
      status: 'BOOKED',
      notes,
      bookedVia,
      idempotencyKey,
    });

    // Update Lead status to APPOINTMENT_BOOKED
    db.updateLead(lead.id, {
      status: 'APPOINTMENT_BOOKED',
      interestedServiceId: service.id,
      preferredDoctorId: doctor.id,
    });

    // Audit Log
    db.createAuditLog({
      clinicId: db.getClinic().id,
      action: 'APPOINTMENT_CREATED',
      entityType: 'APPOINTMENT',
      entityId: appointment.id,
      details: { doctor: doctor.name, service: service.name, date, startTime, bookedVia },
    });

    return appointment;
  }

  // Reschedule Appointment
  rescheduleAppointment(appointmentId: string, date: string, startTime: string, reason?: string): Appointment {
    const apt = db.getAppointmentById(appointmentId);
    if (!apt) throw new AppError('Appointment not found', 404, 'NOT_FOUND');

    // Check availability for new slot
    const availability = this.getAvailability({ date, doctorId: apt.doctorId });
    const slot = availability.slots.find((s) => s.startTime === startTime);
    if (!slot || !slot.available) {
      throw new AppError('The new time slot is unavailable.', 409, 'SLOT_UNAVAILABLE');
    }

    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + apt.durationMinutes;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const updated = db.updateAppointment(appointmentId, {
      date,
      startTime,
      endTime,
      status: 'RESCHEDULED',
      notes: reason ? `${apt.notes || ''} | Rescheduled: ${reason}` : apt.notes,
    });

    db.createAuditLog({
      clinicId: apt.clinicId,
      action: 'APPOINTMENT_RESCHEDULED',
      entityType: 'APPOINTMENT',
      entityId: apt.id,
      details: { oldDate: apt.date, oldTime: apt.startTime, newDate: date, newTime: startTime, reason },
    });

    return updated!;
  }

  // Cancel Appointment
  cancelAppointment(appointmentId: string, reason: string): Appointment {
    const apt = db.getAppointmentById(appointmentId);
    if (!apt) throw new AppError('Appointment not found', 404, 'NOT_FOUND');

    const updated = db.updateAppointment(appointmentId, {
      status: 'CANCELLED',
      cancellationReason: reason,
    });

    db.createAuditLog({
      clinicId: apt.clinicId,
      action: 'APPOINTMENT_CANCELLED',
      entityType: 'APPOINTMENT',
      entityId: apt.id,
      details: { reason },
    });

    return updated!;
  }
}

export const appointmentService = AppointmentService.getInstance();
