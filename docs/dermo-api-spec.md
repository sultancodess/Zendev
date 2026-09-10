# Dermo — API Specification

**Base URL:** `https://api.<dermo-domain>/api/v1`  
**Protocol:** HTTPS  
**Format:** JSON  
**Style:** REST

## 1. Authentication

Dashboard APIs use secure authenticated sessions.

Webhook endpoints use WhatsApp verification/signature mechanisms.

## 2. Auth

```http
POST /auth/login
POST /auth/logout
GET  /auth/me
```

## 3. Clinic

```http
GET   /clinic
PATCH /clinic
```

Example:

```json
{
  "name": "DermaCare Clinic",
  "address": "MG Road",
  "phone": "+919999999999",
  "timezone": "Asia/Kolkata"
}
```

## 4. Business Hours

```http
GET /clinic/hours
PUT /clinic/hours
```

## 5. Doctors

```http
GET    /doctors
POST   /doctors
GET    /doctors/:doctorId
PATCH  /doctors/:doctorId
DELETE /doctors/:doctorId
```

## 6. Doctor Availability

```http
GET /doctors/:doctorId/availability
PUT /doctors/:doctorId/availability
```

## 7. Services

```http
GET    /services
POST   /services
GET    /services/:serviceId
PATCH  /services/:serviceId
DELETE /services/:serviceId
```

## 8. FAQs

```http
GET    /faqs
POST   /faqs
PATCH  /faqs/:faqId
DELETE /faqs/:faqId
POST   /faqs/:faqId/approve
```

## 9. Knowledge

```http
GET    /knowledge/documents
POST   /knowledge/documents
GET    /knowledge/documents/:documentId
DELETE /knowledge/documents/:documentId
POST   /knowledge/documents/:documentId/reindex
```

Document states:

```text
PENDING
PROCESSING
READY
FAILED
```

## 10. Leads

```http
GET   /leads
POST  /leads
GET   /leads/:leadId
PATCH /leads/:leadId
```

Filters:

```text
?status=QUALIFIED
?source=WHATSAPP
```

## 11. Conversations

```http
GET  /conversations
GET  /conversations/:conversationId
GET  /conversations/:conversationId/messages
POST /conversations/:conversationId/messages
```

## 12. Conversation Takeover

```http
POST /conversations/:conversationId/takeover
POST /conversations/:conversationId/release
```

`takeover` pauses AI responses.

`release` allows automated responses again.

## 13. Appointments

```http
GET  /appointments
GET  /appointments/:appointmentId
GET  /appointments/availability
POST /appointments
POST /appointments/:appointmentId/cancel
POST /appointments/:appointmentId/reschedule
```

### Availability

```http
GET /appointments/availability?date=2026-09-15&serviceId=svc_123&doctorId=doc_123
```

Response:

```json
{
  "date": "2026-09-15",
  "slots": [
    {
      "start": "10:00",
      "end": "10:30",
      "available": true
    },
    {
      "start": "10:30",
      "end": "11:00",
      "available": false
    }
  ]
}
```

### Create Appointment

```http
POST /appointments
Idempotency-Key: booking-123
```

```json
{
  "leadId": "lead_123",
  "doctorId": "doc_123",
  "serviceId": "svc_123",
  "date": "2026-09-15",
  "startTime": "10:00"
}
```

The server must validate availability again inside the booking transaction.

## 14. Handoffs

```http
GET  /handoffs
GET  /handoffs/:handoffId
POST /handoffs/:handoffId/resolve
```

## 15. WhatsApp

```http
GET  /whatsapp
POST /whatsapp/connect
```

Only safe integration metadata is returned.

## 16. WhatsApp Webhook

### Verification

```http
GET /webhooks/whatsapp
```

### Events

```http
POST /webhooks/whatsapp
```

Processing:

```text
Receive
 ↓
Verify
 ↓
Parse
 ↓
Check message ID
 ↓
Persist
 ↓
Queue
 ↓
Return success
```

## 17. Analytics

```http
GET /analytics/overview
GET /analytics/timeseries
```

Overview response:

```json
{
  "enquiries": 182,
  "qualifiedLeads": 109,
  "appointmentsBooked": 62,
  "appointmentsCompleted": 49,
  "cancelledAppointments": 6,
  "noShows": 7,
  "humanHandoffs": 12
}
```

These values must come from actual database data; no synthetic/demo metrics in production.

## 18. Staff

```http
GET  /staff
POST /staff/invite
PATCH /staff/:staffId
POST /staff/:staffId/deactivate
```

Roles:

```text
OWNER
STAFF
DOCTOR
```

## 19. Audit Logs

```http
GET /audit-logs
```

Record security-sensitive actions such as:

- staff changes
- knowledge approval
- WhatsApp configuration changes
- appointment modifications
- handoff actions

## 20. Error Contract

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected appointment slot is no longer available.",
    "requestId": "req_123"
  }
}
```

Common codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
SLOT_UNAVAILABLE
DUPLICATE_MESSAGE
WHATSAPP_PROVIDER_ERROR
AI_PROVIDER_ERROR
KNOWLEDGE_NOT_READY
INTERNAL_ERROR
```

## 21. HTTP Status Codes

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

## 22. Internal AI Tools

These are application functions, not public endpoints:

```text
get_clinic_information()
get_service_information()
get_doctor_information()
get_available_slots()
create_lead()
update_lead()
create_appointment()
cancel_appointment()
reschedule_appointment()
create_handoff()
get_faq()
```

## 23. API Documentation

Publish an OpenAPI specification for the REST API.

Development endpoint:

```text
/api/docs
```

Use the documented API contract as the source for SDK/client generation where useful.
