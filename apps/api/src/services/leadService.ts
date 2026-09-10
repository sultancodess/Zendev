import { db } from '../database/db';
import { Lead, LeadSource, LeadStatus } from '@dermo/types';

export class LeadService {
  private static instance: LeadService;

  private constructor() {}

  public static getInstance(): LeadService {
    if (!LeadService.instance) {
      LeadService.instance = new LeadService();
    }
    return LeadService.instance;
  }

  getOrCreateLead(params: { phone: string; name?: string; source?: LeadSource }): Lead {
    const existing = db.getLeadByPhone(params.phone);
    if (existing) {
      if (params.name && (!existing.name || existing.name === 'WhatsApp Patient')) {
        db.updateLead(existing.id, { name: params.name });
      }
      return db.getLeadById(existing.id)!;
    }

    return db.createLead({
      clinicId: db.getClinic().id,
      name: params.name || 'WhatsApp Patient',
      phone: params.phone,
      source: params.source || 'WHATSAPP',
      status: 'NEW',
      tags: ['WhatsApp Inbound'],
      lastContactedAt: new Date().toISOString(),
    });
  }

  updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): Lead | null {
    return db.updateLead(leadId, {
      status,
      notes: notes ? notes : undefined,
      lastContactedAt: new Date().toISOString(),
    });
  }
}

export const leadService = LeadService.getInstance();
