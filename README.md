# Derma.ai — WhatsApp AI Lead & Appointment System (PRD V1.0)

Production-ready, grounded WhatsApp AI assistant and administrative management system for Dermatology & Aesthetic Clinics.

Built with **JavaScript (Node.js Express + React Vite)**.

---

## 🌟 Key Features

1. **Meta WhatsApp Cloud API Integration**:
   - Official WhatsApp Business Cloud API webhook (`/api/webhooks/whatsapp`) with challenge verification.
   - Message idempotency and deduplication on `wa_message_id`.
   - Outgoing text, interactive quick-reply buttons, and template messages.
   - Interactive WhatsApp Mobile Simulator included in dashboard for instant testing.

2. **Grounded AI Conversation Engine**:
   - **Zero Hallucinations**: Grounded strictly on clinic database records for fees, services, doctor schedules, and working hours.
   - **17 Intent Classifications**: `GREETING`, `SERVICE_INFORMATION`, `PRICE_INFORMATION`, `DOCTOR_INFORMATION`, `APPOINTMENT_BOOKING`, `APPOINTMENT_RESCHEDULE`, `APPOINTMENT_CANCEL`, `MEDICAL_QUESTION`, `HUMAN_REQUEST`, `EMERGENCY_SIGNAL`, etc.
   - **Medical Safety Guardrails**: Strict non-diagnostic policy. Medication inquiries automatically trigger safe guidance and create human handoffs.
   - **Multi-language Support**: Natural conversations in English, Hindi, and Hinglish.

3. **Deterministic Appointment Booking**:
   - Dynamic slot calculation respecting doctor shift hours, break times, and appointment duration.
   - Atomic reservation with conflict checks to eliminate double-booking.
   - Reschedule, cancellation, completion, and no-show workflows.

4. **Human Handoff & Receptionist Takeover**:
   - 1-click **Take Over** button: pauses AI immediately so receptionists can reply directly to the patient's WhatsApp from the dashboard.
   - **Return to AI**: resumes autonomous appointment booking anytime.

5. **Google Docs & Sheets Dashboard Live Sync (Toggleable via Flag)**:
   - Easily enabled/disabled via `.env` flag `ENABLE_GOOGLE_DOCS_SYNC=true/false` or the Dashboard Settings toggle.
   - Syncs approved FAQs directly from a Google Doc knowledge base.
   - Streams live leads and confirmed bookings to a connected Google Sheet.

6. **Comprehensive Clinic Dashboard**:
   - Overview KPI Metrics & Conversion Funnels (Qualification, Booking, Completion, No-show rates).
   - Live Conversations & Human Takeover Console.
   - Leads Kanban Board & Filterable Table.
   - Appointment Calendar & Slot Manager.
   - Treatments & Pricing Catalog.
   - Doctor Profiles & Shift Schedule Manager.
   - Approved FAQ Manager.
   - Security Audit Trail (DPDP Act compliance-ready).

---



