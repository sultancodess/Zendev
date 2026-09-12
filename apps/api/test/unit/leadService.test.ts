import { describe, it } from 'node:test';
import assert from 'node:assert';
import { leadService } from '../../src/services/leadService';
import { db } from '../../src/database/db';

describe('Unit Tests: Lead Management & Lifecycle Transitions', () => {
  it('should create or return existing lead by phone number', () => {
    const phone = '+919811122233';
    const lead1 = leadService.getOrCreateLead({
      phone,
      name: 'Rohan Verma',
      source: 'WHATSAPP',
    });

    assert.ok(lead1.id);
    assert.strictEqual(lead1.phone, phone);
    assert.strictEqual(lead1.name, 'Rohan Verma');

    // Calling again with same phone should return existing lead
    const lead2 = leadService.getOrCreateLead({
      phone,
      name: 'Rohan Verma',
      source: 'WHATSAPP',
    });

    assert.strictEqual(lead1.id, lead2.id);
  });

  it('should update lead status and qualification notes', () => {
    const phone = '+919811122244';
    const lead = leadService.getOrCreateLead({
      phone,
      name: 'Sneha Kapoor',
      source: 'WHATSAPP',
    });

    const updated = db.updateLead(lead.id, {
      status: 'QUALIFIED',
      notes: 'Interested in 6 sessions laser package',
    });

    assert.ok(updated);
    assert.strictEqual(updated.status, 'QUALIFIED');
    assert.strictEqual(updated.notes, 'Interested in 6 sessions laser package');
  });

  it('should transition lead to APPOINTMENT_BOOKED on confirmation', () => {
    const phone = '+919811122255';
    const lead = leadService.getOrCreateLead({
      phone,
      name: 'Vikram Joshi',
      source: 'WHATSAPP',
    });

    const updated = db.updateLead(lead.id, {
      status: 'APPOINTMENT_BOOKED',
    });

    assert.ok(updated);
    assert.strictEqual(updated.status, 'APPOINTMENT_BOOKED');
  });
});
