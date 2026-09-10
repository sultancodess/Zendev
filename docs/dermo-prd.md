# Dermo — Product Requirements Document

**Product:** Dermo  
**Positioning:** Managed AI Employee for Clinics  
**Status:** Active Development  
**Initial channel:** WhatsApp  
**Deployment model:** Single-clinic deployment  
**Primary users:** Clinic owner and staff

## 1. Product Summary

Dermo is a managed AI employee for clinics that handles customer conversations through WhatsApp.

It answers clinic-approved questions, captures leads, assists with appointments, and hands complex conversations to staff.

Dermo manages the technology layer:

```text
AI
RAG
WhatsApp integration
Deployment
Monitoring
Backups
Maintenance
```

The clinic manages the business:

```text
Services
Doctors
Prices
Working hours
Appointments
Staff
```

## 2. Problem

Clinics receive repetitive WhatsApp enquiries about:

- services
- pricing
- doctors
- working hours
- location
- appointments
- cancellation
- rescheduling

Manual handling causes delayed responses, missed enquiries, repetitive receptionist work, and inconsistent follow-up.

## 3. Goals

Dermo must:

1. Receive WhatsApp messages.
2. Verify and persist incoming events.
3. Prevent duplicate message processing.
4. Understand conversation intent.
5. Answer approved clinic questions using business data and RAG.
6. Capture leads.
7. Check real appointment availability.
8. Book appointments safely.
9. Support cancellation and rescheduling.
10. Hand conversations to staff.
11. Provide a simple clinic dashboard.
12. Provide operational monitoring.
13. Protect secrets and customer data.
14. Support English, Hindi and Hinglish.

## 4. Non-Goals

Do not build:

- medical diagnosis
- prescription system
- medical image analysis
- voice AI
- multi-tenant SaaS
- generic CRM
- payment gateway
- marketing automation platform
- custom AI model training
- Kubernetes
- microservice fleet

## 5. Target Customer

Initial focus:

- dermatology clinics
- aesthetic clinics
- cosmetic clinics

The ideal clinic receives regular WhatsApp enquiries and manages appointments.

## 6. Core Workflow

```text
Patient
  ↓
WhatsApp
  ↓
Webhook
  ↓
Verify + Deduplicate
  ↓
Persist
  ↓
Queue
  ↓
Conversation Engine
  ↓
RAG / Business Data
  ↓
Tool
  ↓
Response
  ↓
WhatsApp
```

## 7. Core Capabilities

### Customer Conversation

The AI can answer:

- clinic information
- services
- doctor information
- working hours
- approved FAQs

### Lead Capture

Lead states:

```text
NEW
CONTACTED
QUALIFIED
APPOINTMENT_BOOKED
CONVERTED
LOST
```

### Appointment Management

Support:

```text
Availability
Booking
Confirmation
Cancellation
Rescheduling
```

### Human Handoff

Trigger handoff when:

- user requests staff
- medical input is required
- emergency signal is detected
- AI cannot answer reliably
- repeated misunderstanding occurs

## 8. AI Rules

The LLM may:

- understand user intent
- generate responses
- choose approved tools
- use retrieved knowledge

The LLM may not directly control:

- appointments
- availability
- service prices
- lead records
- permissions
- arbitrary database writes

## 9. RAG

Approved clinic knowledge is:

```text
Document / FAQ
   ↓
Chunk
   ↓
Embedding
   ↓
pgvector
   ↓
Retrieve
   ↓
LLM
```

Only approved/current information should be used for production answers.

## 10. Dashboard

Navigation:

```text
Overview
Conversations
Leads
Appointments
Services
Doctors
Knowledge
WhatsApp
Analytics
Settings
```

The dashboard should prioritize operational actions over decorative analytics.

## 11. Overview Metrics

Show:

- enquiries
- qualified leads
- appointments
- completed appointments
- cancellations
- no-shows
- human handoffs

## 12. Conversation Management

Staff can:

- view conversation
- view lead
- view appointment
- reply manually
- take over
- return conversation to AI
- add notes

AI must pause during human takeover.

## 13. Knowledge Management

Staff can manage:

- clinic information
- doctors
- services
- FAQs
- approved documents

Knowledge indexing should expose status:

```text
PENDING
PROCESSING
READY
FAILED
```

## 14. WhatsApp

Support:

- webhook verification
- inbound messages
- outbound messages
- delivery status
- templates where required
- customer-service-window rules

## 15. Reliability

The system must use:

- durable persistence
- asynchronous message processing
- idempotency
- explicit external-call timeouts
- controlled retries
- structured error handling

## 16. Security

Required:

- HTTPS
- secure authentication
- authorization
- input validation
- rate limiting
- secret management
- webhook verification
- audit logs
- secret redaction
- encrypted backups

## 17. Success Criteria

Dermo is ready for a real clinic when:

- WhatsApp messages are reliably received
- duplicate events are ignored
- clinic answers are grounded
- leads are captured
- availability is accurate
- booking cannot double-book a slot
- staff can take over
- medical questions escalate
- dashboard reflects real state
- failures are observable
- backups and deployment are documented

## 18. Product Success Metric

The business outcome is:

**More enquiries captured and converted into appointments with less receptionist workload.**
