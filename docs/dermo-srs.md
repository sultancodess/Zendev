# Dermo — Software Requirements Specification

## 1. Purpose

This SRS converts Dermo's product requirements into testable software requirements.

## 2. Actors

### Patient
Sends messages through WhatsApp.

### Clinic Staff
Manages conversations, leads, appointments and clinic data.

### Clinic Owner
Manages the clinic and staff.

### Dermo Application
Processes messages, runs AI workflows and manages business state.

### Worker
Processes asynchronous jobs.

### External Providers
WhatsApp and AI providers.

## 3. Functional Requirements

### SRS-001 Authentication — P0

Protected dashboard endpoints shall require valid authentication.

### SRS-002 Authorization — P0

Users shall only perform actions permitted by their role.

### SRS-003 Webhook Verification — P0

Incoming WhatsApp webhook requests shall be verified before processing.

### SRS-004 Message Idempotency — P0

The same provider message ID shall not result in duplicate message processing.

### SRS-005 Durable Persistence — P0

An accepted inbound message shall be persisted before successful webhook acknowledgement.

### SRS-006 Async Processing — P0

Expensive AI processing shall execute outside the webhook request path.

### SRS-007 Intent Detection — P0

The system shall classify supported conversation intents.

### SRS-008 Grounded Answers — P0

Business-related answers shall use current clinic data and approved knowledge.

### SRS-009 Safe Fallback — P0

When sufficient knowledge is unavailable, the AI shall provide a safe fallback or human escalation rather than inventing an answer.

### SRS-010 Tool Validation — P0

All AI tool requests shall be validated by application services before execution.

### SRS-011 Lead Creation — P0

The system shall create or update a lead from supported conversations.

### SRS-012 Appointment Availability — P0

The system shall return appointment availability based on actual doctor/service schedules and existing appointments.

### SRS-013 Appointment Booking — P0

Appointment creation shall perform server-side validation and conflict checking.

### SRS-014 Appointment Idempotency — P0

A retried booking request shall not create duplicate appointments.

### SRS-015 Cancellation — P0

Authorized users and supported AI flows shall be able to cancel appointments.

### SRS-016 Rescheduling — P0

Authorized users and supported AI flows shall be able to reschedule appointments.

### SRS-017 Human Handoff — P0

Users shall be able to request human assistance and staff shall be able to take over conversations.

### SRS-018 AI Pause During Takeover — P0

AI automated responses shall stop while a staff member owns the conversation.

### SRS-019 Medical Safety — P0

The system shall not diagnose or prescribe medication.

### SRS-020 Emergency Escalation — P0

Emergency signals shall route to human handling according to configured clinic procedures.

### SRS-021 Knowledge Management — P0

Authorized staff shall be able to create, update, approve and remove clinic knowledge.

### SRS-022 Knowledge Indexing — P0

Approved knowledge documents shall be indexed before becoming available to production retrieval.

### SRS-023 WhatsApp Outbound — P0

The system shall send supported WhatsApp messages and track provider results.

### SRS-024 Messaging Policy — P0

Outbound messaging shall follow applicable WhatsApp customer-service-window and template rules.

### SRS-025 Dashboard — P0

The dashboard shall show actual conversations, leads and appointment data.

### SRS-026 Monitoring — P0

Operational failures shall generate structured logs and monitoring signals.

## 4. Non-Functional Requirements

### NFR-001 Webhook Responsiveness

Normal webhook processing should acknowledge quickly without waiting for AI generation.

### NFR-002 Durability

Accepted inbound messages shall survive worker restart.

### NFR-003 Consistency

Appointment booking shall not permit duplicate exclusive slot reservations.

### NFR-004 Security

TLS, secure authentication, authorization, secret protection, input validation and rate limiting are mandatory.

### NFR-005 Observability

Each message and important business operation shall be traceable using identifiers.

### NFR-006 Recoverability

Database backup and restore procedures shall exist and be tested.

### NFR-007 Maintainability

The system shall use modular application boundaries and documented interfaces.

### NFR-008 Scalability

API and workers should be independently scalable without changing public API contracts.

## 5. Data Requirements

### Clinic

```text
id
name
address
phone
email
website
timezone
hours
```

### Staff

```text
id
clinic_id
name
email
role
status
```

### Doctor

```text
id
clinic_id
name
qualification
specialty
schedule
status
```

### Service

```text
id
clinic_id
name
description
price
duration_minutes
booking_enabled
status
```

### Lead

```text
id
clinic_id
name
phone
source
service_id
status
assigned_staff_id
created_at
updated_at
```

### Conversation

```text
id
clinic_id
lead_id
phone
state
mode
intent
created_at
updated_at
```

### Message

```text
id
conversation_id
provider_message_id
direction
content
status
created_at
```

### Appointment

```text
id
clinic_id
lead_id
doctor_id
service_id
start_time
end_time
status
created_at
updated_at
```

### Knowledge Document

```text
id
clinic_id
title
category
status
version
created_at
updated_at
```

### Knowledge Chunk

```text
id
document_id
content
embedding
metadata
```

### Handoff

```text
id
conversation_id
reason
status
assigned_staff_id
created_at
resolved_at
```

## 6. State Machines

### Conversation

```text
START
 ↓
INFORMATION
 ↓
QUALIFICATION
 ↓
BOOKING
 ↓
CONFIRMATION
 ↓
COMPLETED
```

Alternative transitions:

```text
ANY → HANDOFF
BOOKING → CANCELLED
```

### Knowledge Document

```text
PENDING
 ↓
PROCESSING
 ├→ READY
 └→ FAILED
```

### Appointment

```text
BOOKED
 ↓
CONFIRMED
 ↓
COMPLETED
```

Alternative:

```text
BOOKED → CANCELLED
BOOKED → RESCHEDULED
BOOKED → NO_SHOW
```

## 7. AI Evaluation

Create a versioned evaluation set covering:

- clinic FAQs
- pricing questions
- service questions
- doctor questions
- appointment booking
- cancellation
- rescheduling
- unknown questions
- medical questions
- emergency signals
- human requests

For every test case define:

```text
input
expected intent
expected action
allowed tools
forbidden behavior
expected escalation
```

## 8. Testing Requirements

### Unit Tests

- validation
- lead state transitions
- appointment availability
- booking conflicts
- conversation state
- safety rules

### Integration Tests

- PostgreSQL
- Redis
- BullMQ
- WhatsApp webhook
- AI tool execution
- RAG retrieval
- appointment transactions

### E2E Tests

Required path:

```text
WhatsApp
→ Webhook
→ Persist
→ Queue
→ AI
→ Tool
→ Appointment
→ Response
```

### Failure Tests

Simulate:

- duplicate webhook
- worker restart
- Redis restart
- LLM timeout
- WhatsApp API failure
- database failure
- booking conflict

### Security Tests

Test:

- auth bypass
- authorization bypass
- secret leakage
- malformed webhook
- rate-limit bypass
- unsafe input

## 9. Performance Targets

Initial engineering targets:

```text
Dashboard API p95 < 500 ms
Normal webhook application acknowledgement < 500 ms
```

AI model latency should be measured separately from API latency.

These are test targets, not public performance claims.

## 10. Logging

Structured logs should include:

```text
request_id
conversation_id
message_id
appointment_id
event
latency_ms
status
error_code
```

Never log:

- API keys
- passwords
- provider access tokens
- database credentials
- raw secrets

## 11. Backup and Recovery

Required:

- automated PostgreSQL backups
- documented retention
- backup verification
- documented restore procedure
- periodic restore test

## 12. Release Acceptance

Dermo is release-ready when:

1. WhatsApp webhook verification passes.
2. Duplicate messages are safely handled.
3. Accepted messages are persisted before acknowledgement.
4. AI answers approved business questions correctly.
5. RAG retrieval works for approved knowledge.
6. Unknown questions use a safe fallback.
7. Medical questions escalate.
8. Leads are captured correctly.
9. Appointment availability is accurate.
10. Duplicate booking is prevented.
11. Cancellation and rescheduling work.
12. Human takeover pauses AI.
13. Dashboard data matches database state.
14. Monitoring is active.
15. Secrets are protected.
16. End-to-end tests pass.
17. Backup and restore have been tested.
