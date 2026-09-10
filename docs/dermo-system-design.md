# Dermo — System Design & Architecture

## 1. Architecture

Dermo is a modular monolith for a single clinic deployment.

```text
                         PATIENT
                            │
                         WhatsApp
                            │
                            ▼
                  ┌──────────────────┐
                  │ WhatsApp Cloud   │
                  │ API              │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Webhook Handler  │
                  │ Verify + Dedupe  │
                  └────────┬─────────┘
                           │
                           ▼
                    PostgreSQL
                    + pgvector
                           │
                           ▼
                    Redis + BullMQ
                           │
                           ▼
                  Conversation Engine
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
            RAG            LLM          Tools
             │             │             │
             │             │       ┌─────┼─────┐
             │             │       ▼     ▼     ▼
             │             │     Leads Booking Handoff
             │             │
             └─────────────┼─────────────┘
                           ▼
                    Response Validation
                           │
                           ▼
                        WhatsApp
```

## 2. Architecture Principles

1. PostgreSQL is the source of truth.
2. Redis/BullMQ handles asynchronous work.
3. Business rules remain in application services.
4. LLMs never get arbitrary database access.
5. Webhooks acknowledge before AI processing.
6. Appointment booking is transactional.
7. Human takeover pauses AI.
8. Production knowledge must be approved/current.
9. Keep the deployment simple enough for one engineer to operate.

## 3. Request Flow

Dashboard/API request:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Controller
 ↓
Application Service
 ↓
PostgreSQL
 ↓
Response
```

## 4. WhatsApp Inbound Flow

```text
WhatsApp
 ↓
Webhook
 ↓
Verify
 ↓
Parse
 ↓
Extract provider message ID
 ↓
Idempotency check
 ↓
Persist message
 ↓
Create processing job
 ↓
Return success
```

Do not block the webhook on LLM or appointment processing.

## 5. Conversation Worker

```text
Queue Job
 ↓
Load Conversation
 ↓
Intent Detection
 ↓
Safety Classification
 ↓
Load Conversation State
 ↓
Load Clinic Context
 ↓
RAG Retrieval
 ↓
LLM Response / Tool Selection
 ↓
Tool Execution
 ↓
Response Validation
 ↓
Persist Result
 ↓
Send WhatsApp Message
```

## 6. Conversation State

Use explicit state:

```text
START
INFORMATION
QUALIFICATION
BOOKING
CONFIRMATION
COMPLETED
HANDOFF
CANCELLED
```

State belongs to the application, not only to model context.

## 7. AI Layer

Create an internal abstraction:

```text
AIService
 ├── classifyIntent()
 ├── classifySafety()
 ├── generateResponse()
 └── embed()
```

Keep provider-specific calls inside the provider adapter.

## 8. RAG Architecture

```text
Clinic Content
 ↓
Text Extraction
 ↓
Chunking
 ↓
Embedding
 ↓
PostgreSQL + pgvector
 ↓
Similarity Search
 ↓
Approved Context
 ↓
LLM
```

Metadata should include:

```text
document_id
category
status
version
updated_at
```

## 9. Tool Execution

Allowed tools:

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
```

Flow:

```text
LLM Tool Request
 ↓
Zod Validation
 ↓
Application Service
 ↓
Business Rules
 ↓
Database
 ↓
Tool Result
```

## 10. Appointment Consistency

Booking flow:

```text
Booking Request
 ↓
Validate Inputs
 ↓
BEGIN TRANSACTION
 ↓
Check Current Availability
 ↓
Check Conflict
 ↓
Create Appointment
 ↓
COMMIT
```

The availability query shown to the patient is not enough; the server must validate the slot again during booking.

## 11. Lead Management

Lead lifecycle:

```text
NEW
 ↓
CONTACTED
 ↓
QUALIFIED
 ↓
APPOINTMENT_BOOKED
 ↓
CONVERTED / LOST
```

Lead information is linked to the conversation and appointment where applicable.

## 12. Human Handoff

```text
AI Conversation
 ↓
Handoff Trigger
 ↓
Create Handoff
 ↓
Pause AI
 ↓
Staff Takes Over
 ↓
Manual Response
 ↓
Return to AI
```

## 13. Safety

```text
Incoming Message
 ↓
Safety Check
 ├── Normal → Continue
 ├── Medical → Human
 ├── Emergency → Immediate Escalation
 └── Unknown → Safe Fallback
```

Dermo must not diagnose or prescribe medication.

## 14. Outbound WhatsApp Flow

```text
Application
 ↓
Outbound Message Service
 ↓
Check messaging rules/window
 ↓
Normal message or approved template
 ↓
WhatsApp API
 ↓
Persist provider status
```

## 15. Reliability

External calls require:

- timeout
- error classification
- retry where safe
- logging
- failure visibility

Do not blindly retry appointment creation or other non-idempotent operations.

## 16. Idempotency

Store provider message IDs with a unique constraint.

```text
First message
 → process

Duplicate message
 → ignore
```

For booking, use application-level idempotency keys where the operation can be retried.

## 17. Database

Core entities:

```text
users
clinic
staff
doctors
services
faqs
knowledge_documents
knowledge_chunks
leads
conversations
messages
appointments
appointment_slots
handoffs
whatsapp_accounts
whatsapp_messages
message_templates
audit_logs
```

## 18. Observability

Track:

```text
HTTP errors
Webhook errors
Queue failures
LLM failures
RAG latency
Tool failures
Appointment failures
WhatsApp delivery failures
Database errors
Authentication failures
```

Include:

```text
request_id
conversation_id
message_id
appointment_id
```

in structured logs.

## 19. Security

Protect:

- staff sessions
- provider tokens
- AI API keys
- database credentials
- webhook secrets

Never expose secrets through dashboard responses or logs.

## 20. Deployment

Initial topology:

```text
Cloudflare
    ↓
Application Server
 ├── Web
 ├── API
 └── Worker
    ↓
PostgreSQL
    ↓
Redis
```

Use Docker and GitHub Actions.

Do not introduce Kubernetes until actual scale requires it.

## 21. Testing

### Unit

- availability
- booking rules
- lead transitions
- validation
- safety logic

### Integration

- PostgreSQL
- WhatsApp webhook
- RAG
- AI tools
- appointment transaction

### E2E

```text
WhatsApp
 ↓
AI
 ↓
Lead
 ↓
Availability
 ↓
Booking
 ↓
Confirmation
```

## 22. Key Invariants

1. Duplicate WhatsApp events do not create duplicate records.
2. AI cannot invent appointment availability.
3. AI cannot directly modify arbitrary data.
4. A booking must pass server-side availability validation.
5. Human takeover stops automated responses.
6. Medical conversations do not receive diagnosis/prescription.
7. Secrets never appear in normal logs or responses.
