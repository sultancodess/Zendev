const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `HTTP error! status: ${res.status}`);
    }
    return data.data !== undefined ? data.data : data;
  } catch (err: any) {
    console.error(`API Error on [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Clinic
  getClinic: () => fetcher<any>('/clinic'),
  updateClinic: (payload: any) => fetcher<any>('/clinic', { method: 'PATCH', body: JSON.stringify(payload) }),
  getClinicHours: () => fetcher<any>('/clinic/hours'),

  // Doctors
  getDoctors: () => fetcher<any[]>('/doctors'),
  getDoctor: (id: string) => fetcher<any>(`/doctors/${id}`),
  createDoctor: (payload: any) => fetcher<any>('/doctors', { method: 'POST', body: JSON.stringify(payload) }),
  getDoctorAvailability: (doctorId: string, date: string) =>
    fetcher<any>(`/doctors/${doctorId}/availability?date=${date}`),

  // Services
  getServices: () => fetcher<any[]>('/services'),
  createService: (payload: any) => fetcher<any>('/services', { method: 'POST', body: JSON.stringify(payload) }),

  // Appointments
  getAppointments: () => fetcher<any[]>('/appointments'),
  getAppointmentAvailability: (params: { date: string; doctorId?: string; serviceId?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetcher<any>(`/appointments/availability?${q}`);
  },
  createAppointment: (payload: any) =>
    fetcher<any>('/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  rescheduleAppointment: (id: string, payload: { date: string; startTime: string; reason?: string }) =>
    fetcher<any>(`/appointments/${id}/reschedule`, { method: 'POST', body: JSON.stringify(payload) }),
  cancelAppointment: (id: string, reason: string) =>
    fetcher<any>(`/appointments/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Leads
  getLeads: (params?: { status?: string; source?: string }) => {
    const q = params ? `?${new URLSearchParams(params).toString()}` : '';
    return fetcher<any[]>(`/leads${q}`);
  },
  createLead: (payload: any) => fetcher<any>('/leads', { method: 'POST', body: JSON.stringify(payload) }),
  updateLead: (id: string, payload: any) =>
    fetcher<any>(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  // Conversations
  getConversations: () => fetcher<any[]>('/conversations'),
  getConversation: (id: string) => fetcher<any>(`/conversations/${id}`),
  getMessages: (id: string) => fetcher<any[]>(`/conversations/${id}/messages`),
  sendStaffMessage: (id: string, content: string) =>
    fetcher<any>(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
  takeoverConversation: (id: string) => fetcher<any>(`/conversations/${id}/takeover`, { method: 'POST' }),
  releaseConversation: (id: string) => fetcher<any>(`/conversations/${id}/release`, { method: 'POST' }),

  // Knowledge & FAQs
  getFaqs: () => fetcher<any[]>('/faqs'),
  createFaq: (payload: any) => fetcher<any>('/faqs', { method: 'POST', body: JSON.stringify(payload) }),
  deleteFaq: (id: string) => fetcher<any>(`/faqs/${id}`, { method: 'DELETE' }),
  getKnowledgeDocs: () => fetcher<any[]>('/knowledge/documents'),
  createKnowledgeDoc: (payload: any) =>
    fetcher<any>('/knowledge/documents', { method: 'POST', body: JSON.stringify(payload) }),
  reindexDoc: (id: string) => fetcher<any>(`/knowledge/documents/${id}/reindex`, { method: 'POST' }),

  // Payments (Razorpay)
  getPayments: () => fetcher<any[]>('/payments'),
  createPaymentOrder: (payload: { leadId: string; amount: number; appointmentId?: string; description?: string }) =>
    fetcher<any>('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    fetcher<any>('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),

  // Simulator & WhatsApp
  sendSimulatorMessage: (payload: { phone: string; name?: string; message: string }) =>
    fetcher<any>('/whatsapp/simulator/send', { method: 'POST', body: JSON.stringify(payload) }),
  getWhatsAppStatus: () => fetcher<any>('/whatsapp/status'),

  // Analytics & Audit Logs
  getAnalyticsOverview: () => fetcher<any>('/analytics/overview'),
  getAnalyticsTimeseries: () => fetcher<any[]>('/analytics/timeseries'),
  getAuditLogs: () => fetcher<any[]>('/audit-logs'),
};
