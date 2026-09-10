import {
  Clinic,
  StaffUser,
  Doctor,
  Service,
  Lead,
  Appointment,
  Conversation,
  WhatsAppMessage,
  FAQ,
  KnowledgeDocument,
  KnowledgeChunk,
  RazorpayOrder,
  AuditLog,
} from '@dermo/types';

export interface DatabaseState {
  clinic: Clinic;
  users: StaffUser[];
  doctors: Doctor[];
  services: Service[];
  leads: Lead[];
  appointments: Appointment[];
  conversations: Conversation[];
  messages: WhatsAppMessage[];
  faqs: FAQ[];
  knowledgeDocuments: KnowledgeDocument[];
  knowledgeChunks: KnowledgeChunk[];
  payments: RazorpayOrder[];
  auditLogs: AuditLog[];
  processedMessageIds: Set<string>;
}

// In-memory persistent state holder for development & demonstration
class Database {
  private static instance: Database;
  public state: DatabaseState;

  private constructor() {
    this.state = {
      clinic: {} as Clinic,
      users: [],
      doctors: [],
      services: [],
      leads: [],
      appointments: [],
      conversations: [],
      messages: [],
      faqs: [],
      knowledgeDocuments: [],
      knowledgeChunks: [],
      payments: [],
      auditLogs: [],
      processedMessageIds: new Set<string>(),
    };
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Clinic
  getClinic(): Clinic {
    return this.state.clinic;
  }

  updateClinic(updates: Partial<Clinic>): Clinic {
    this.state.clinic = {
      ...this.state.clinic,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.clinic;
  }

  // Doctors
  getDoctors(): Doctor[] {
    return this.state.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.state.doctors.find((d) => d.id === id);
  }

  createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Doctor {
    const newDoctor: Doctor = {
      ...doctor,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.doctors.push(newDoctor);
    return newDoctor;
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Doctor | null {
    const index = this.state.doctors.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.state.doctors[index] = {
      ...this.state.doctors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.doctors[index];
  }

  deleteDoctor(id: string): boolean {
    const initialLength = this.state.doctors.length;
    this.state.doctors = this.state.doctors.filter((d) => d.id !== id);
    return this.state.doctors.length < initialLength;
  }

  // Services
  getServices(): Service[] {
    return this.state.services;
  }

  getServiceById(id: string): Service | undefined {
    return this.state.services.find((s) => s.id === id);
  }

  createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const newService: Service = {
      ...service,
      id: `svc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.services.push(newService);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const index = this.state.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.state.services[index] = {
      ...this.state.services[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.services[index];
  }

  deleteService(id: string): boolean {
    const initialLength = this.state.services.length;
    this.state.services = this.state.services.filter((s) => s.id !== id);
    return this.state.services.length < initialLength;
  }

  // Leads
  getLeads(): Lead[] {
    return this.state.leads;
  }

  getLeadById(id: string): Lead | undefined {
    return this.state.leads.find((l) => l.id === id);
  }

  getLeadByPhone(phone: string): Lead | undefined {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.state.leads.find((l) => l.phone.replace(/[^0-9]/g, '').includes(cleanPhone) || cleanPhone.includes(l.phone.replace(/[^0-9]/g, '')));
  }

  createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.leads.unshift(newLead);
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const index = this.state.leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    this.state.leads[index] = {
      ...this.state.leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.leads[index];
  }

  // Appointments
  getAppointments(): Appointment[] {
    return this.state.appointments;
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.state.appointments.find((a) => a.id === id);
  }

  getAppointmentsByDoctorAndDate(doctorId: string, date: string): Appointment[] {
    return this.state.appointments.filter(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.status !== 'CANCELLED'
    );
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.appointments.unshift(newAppointment);
    return newAppointment;
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const index = this.state.appointments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.state.appointments[index] = {
      ...this.state.appointments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.appointments[index];
  }

  // Conversations & Messages
  getConversations(): Conversation[] {
    return this.state.conversations;
  }

  getConversationById(id: string): Conversation | undefined {
    return this.state.conversations.find((c) => c.id === id);
  }

  getConversationByPhone(phone: string): Conversation | undefined {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.state.conversations.find((c) => c.patientPhone.replace(/[^0-9]/g, '').includes(cleanPhone) || cleanPhone.includes(c.patientPhone.replace(/[^0-9]/g, '')));
  }

  createConversation(conv: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Conversation {
    const newConv: Conversation = {
      ...conv,
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.conversations.unshift(newConv);
    return newConv;
  }

  updateConversation(id: string, updates: Partial<Conversation>): Conversation | null {
    const index = this.state.conversations.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.state.conversations[index] = {
      ...this.state.conversations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.conversations[index];
  }

  getMessagesByConversationId(conversationId: string): WhatsAppMessage[] {
    return this.state.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  createMessage(msg: Omit<WhatsAppMessage, 'id' | 'createdAt'>): WhatsAppMessage {
    const newMessage: WhatsAppMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.messages.push(newMessage);
    
    // Update conversation last message timestamp & preview
    const conv = this.getConversationById(msg.conversationId);
    if (conv) {
      this.updateConversation(conv.id, {
        lastMessageAt: newMessage.createdAt,
        lastMessagePreview: msg.content.substring(0, 80),
      });
    }

    return newMessage;
  }

  // Idempotency for WhatsApp message IDs
  isMessageProcessed(providerMessageId: string): boolean {
    return this.state.processedMessageIds.has(providerMessageId);
  }

  markMessageProcessed(providerMessageId: string): void {
    this.state.processedMessageIds.add(providerMessageId);
  }

  // FAQs & Knowledge
  getFaqs(): FAQ[] {
    return this.state.faqs;
  }

  getFaqById(id: string): FAQ | undefined {
    return this.state.faqs.find((f) => f.id === id);
  }

  createFaq(faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): FAQ {
    const newFaq: FAQ = {
      ...faq,
      id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.faqs.unshift(newFaq);
    return newFaq;
  }

  updateFaq(id: string, updates: Partial<FAQ>): FAQ | null {
    const index = this.state.faqs.findIndex((f) => f.id === id);
    if (index === -1) return null;
    this.state.faqs[index] = {
      ...this.state.faqs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.faqs[index];
  }

  deleteFaq(id: string): boolean {
    const initialLength = this.state.faqs.length;
    this.state.faqs = this.state.faqs.filter((f) => f.id !== id);
    return this.state.faqs.length < initialLength;
  }

  getKnowledgeDocuments(): KnowledgeDocument[] {
    return this.state.knowledgeDocuments;
  }

  createKnowledgeDocument(doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeDocument {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `kdoc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.knowledgeDocuments.unshift(newDoc);
    return newDoc;
  }

  updateKnowledgeDocument(id: string, updates: Partial<KnowledgeDocument>): KnowledgeDocument | null {
    const index = this.state.knowledgeDocuments.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.state.knowledgeDocuments[index] = {
      ...this.state.knowledgeDocuments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.knowledgeDocuments[index];
  }

  deleteKnowledgeDocument(id: string): boolean {
    const initialLength = this.state.knowledgeDocuments.length;
    this.state.knowledgeDocuments = this.state.knowledgeDocuments.filter((d) => d.id !== id);
    this.state.knowledgeChunks = this.state.knowledgeChunks.filter((c) => c.documentId !== id);
    return this.state.knowledgeDocuments.length < initialLength;
  }

  // Knowledge Chunks for RAG Vector Store
  addKnowledgeChunks(chunks: KnowledgeChunk[]): void {
    this.state.knowledgeChunks.push(...chunks);
  }

  getKnowledgeChunks(): KnowledgeChunk[] {
    return this.state.knowledgeChunks;
  }

  // Razorpay Payments
  getPayments(): RazorpayOrder[] {
    return this.state.payments;
  }

  getPaymentByOrderId(orderId: string): RazorpayOrder | undefined {
    return this.state.payments.find((p) => p.orderId === orderId);
  }

  createPayment(payment: Omit<RazorpayOrder, 'id' | 'createdAt' | 'updatedAt'>): RazorpayOrder {
    const newPayment: RazorpayOrder = {
      ...payment,
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.payments.unshift(newPayment);
    return newPayment;
  }

  updatePayment(id: string, updates: Partial<RazorpayOrder>): RazorpayOrder | null {
    const index = this.state.payments.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.state.payments[index] = {
      ...this.state.payments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.state.payments[index];
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(newLog);
    return newLog;
  }
}

export const db = Database.getInstance();
