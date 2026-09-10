import { db } from './db';
import { Clinic, DoctorShift } from '@dermo/types';

export function seedDatabase() {
  console.log('🌱 Seeding Dermo Clinic Database...');

  const standardSchedule: DoctorShift[] = [
    { day: 'monday', startTime: '10:00', endTime: '18:00', slotDurationMinutes: 30, breakStart: '13:00', breakEnd: '14:00', isWorking: true },
    { day: 'tuesday', startTime: '10:00', endTime: '18:00', slotDurationMinutes: 30, breakStart: '13:00', breakEnd: '14:00', isWorking: true },
    { day: 'wednesday', startTime: '10:00', endTime: '18:00', slotDurationMinutes: 30, breakStart: '13:00', breakEnd: '14:00', isWorking: true },
    { day: 'thursday', startTime: '10:00', endTime: '18:00', slotDurationMinutes: 30, breakStart: '13:00', breakEnd: '14:00', isWorking: true },
    { day: 'friday', startTime: '10:00', endTime: '18:00', slotDurationMinutes: 30, breakStart: '13:00', breakEnd: '14:00', isWorking: true },
    { day: 'saturday', startTime: '10:00', endTime: '17:00', slotDurationMinutes: 30, breakStart: '13:00', breakEnd: '13:30', isWorking: true },
    { day: 'sunday', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30, isWorking: false },
  ];

  // 1. Clinic
  const clinic: Clinic = {
    id: 'clinic_dermacare_01',
    name: 'DermaCare Aesthetics & Laser Clinic',
    tagline: 'Advanced Dermatology & Premium Aesthetics',
    description: 'Premier aesthetic dermatology clinic specializing in advanced skin rejuvenation, medical lasers, acne clearance, and hair restoration.',
    address: '42, 100 Feet Road, 4th Block, Koramangala',
    city: 'Bengaluru, Karnataka 560034',
    phone: '+91 98765 43210',
    email: 'hello@dermacareclinic.in',
    website: 'https://dermacareclinic.in',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    hours: [
      { day: 'monday', open: '09:00', close: '20:00', isOpen: true },
      { day: 'tuesday', open: '09:00', close: '20:00', isOpen: true },
      { day: 'wednesday', open: '09:00', close: '20:00', isOpen: true },
      { day: 'thursday', open: '09:00', close: '20:00', isOpen: true },
      { day: 'friday', open: '09:00', close: '20:00', isOpen: true },
      { day: 'saturday', open: '09:00', close: '19:00', isOpen: true },
      { day: 'sunday', open: '10:00', close: '16:00', isOpen: true },
    ],
    enableGoogleDocsSync: false,
    enableRazorpayDeposits: true,
    consultationDepositAmount: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.updateClinic(clinic);

  // 2. Doctors
  const doc1 = db.createDoctor({
    clinicId: clinic.id,
    name: 'Dr. Priya Sharma',
    title: 'Chief Consultant Dermatologist',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    specialty: ['Acne & Scar Treatments', 'Anti-Aging & Injectables', 'Clinical Dermatology'],
    experienceYears: 12,
    consultationFee: 1000,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    bio: 'Gold medalist dermatologist with over a decade of clinical experience in advanced skin therapies, acne remission, and cosmetic dermatology.',
    schedule: standardSchedule,
    status: 'ACTIVE',
  });

  const doc2 = db.createDoctor({
    clinicId: clinic.id,
    name: 'Dr. Rohan Mehta',
    title: 'Senior Aesthetic & Laser Specialist',
    qualification: 'MBBS, DVD, FAM (Fellowship in Aesthetic Medicine, Germany)',
    specialty: ['Laser Hair Reduction', 'PRP Hair Restoration', 'Pigmentation & Melasma'],
    experienceYears: 8,
    consultationFee: 800,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    bio: 'Pioneer in laser aesthetic procedures, non-invasive facial contouring, and holistic hair restoration treatments.',
    schedule: standardSchedule,
    status: 'ACTIVE',
  });

  // 3. Services
  const svcHydra = db.createService({
    clinicId: clinic.id,
    name: 'HydraFacial MD Elite Glow',
    category: 'FACIAL_AESTHETICS',
    description: 'Multi-step medical grade hydra-dermabrasion that cleanses, exfoliates, extracts impurities, and infuses antioxidant peptides for instant radiance.',
    benefits: ['Deep pore cleansing', 'Instant hydration & glow', 'Zero downtime', 'Suitable for all skin types'],
    price: 3500,
    durationMinutes: 45,
    depositRequired: true,
    depositAmount: 500,
    bookingEnabled: true,
    requiresConsultationFirst: false,
    status: 'ACTIVE',
  });

  const svcLaser = db.createService({
    clinicId: clinic.id,
    name: 'Triple-Wavelength Laser Hair Reduction',
    category: 'LASER_TREATMENTS',
    description: 'US-FDA approved painless diode + alexandrite laser technology with ice-cooling tip for permanent hair reduction.',
    benefits: ['90%+ permanent hair reduction', 'Virtually painless cooling', 'Quick session time', 'Safe for Indian skin tones'],
    price: 4500,
    durationMinutes: 45,
    depositRequired: true,
    depositAmount: 500,
    bookingEnabled: true,
    requiresConsultationFirst: false,
    status: 'ACTIVE',
  });

  const svcPRP = db.createService({
    clinicId: clinic.id,
    name: 'GFC & PRP Hair Restoration Therapy',
    category: 'HAIR_RESTORATION',
    description: 'Autologous growth factor concentrate therapy using high-concentration platelets to activate dormant hair follicles and stop shedding.',
    benefits: ['Stimulates natural hair regrowth', 'Thickens existing strands', 'Zero risk of allergic reaction', 'High growth factor yield'],
    price: 5000,
    durationMinutes: 60,
    depositRequired: true,
    depositAmount: 500,
    bookingEnabled: true,
    requiresConsultationFirst: true,
    status: 'ACTIVE',
  });

  const svcAcnePeel = db.createService({
    clinicId: clinic.id,
    name: 'Salicylic & Mandelic Chemical Peel',
    category: 'CLINICAL_DERMATOLOGY',
    description: 'Targeted beta-hydroxy acid peel to dissolve sebum plugs, eliminate active acne bacteria, and fade post-inflammatory hyperpigmentation (PIH).',
    benefits: ['Controls active breakouts', 'Reduces excess oil production', 'Fades acne marks', 'Evens skin tone'],
    price: 2200,
    durationMinutes: 30,
    depositRequired: false,
    depositAmount: 0,
    bookingEnabled: true,
    requiresConsultationFirst: false,
    status: 'ACTIVE',
  });

  const svcBotox = db.createService({
    clinicId: clinic.id,
    name: 'Botox Anti-Wrinkle Smoothing',
    category: 'ANTI_AGING',
    description: 'Allergan-certified botulinum neuromodulator treatment for forehead lines, crow’s feet, and frown lines for a natural refreshed look.',
    benefits: ['Smooths dynamic wrinkles', 'Prevents deep wrinkle formation', 'Noticeable results within 3-7 days', 'Administered by MD doctors only'],
    price: 8500,
    durationMinutes: 45,
    depositRequired: true,
    depositAmount: 1000,
    bookingEnabled: true,
    requiresConsultationFirst: true,
    status: 'ACTIVE',
  });

  // 4. Approved FAQs
  db.createFaq({
    clinicId: clinic.id,
    question: 'What is the consultation fee and is it adjusted in treatments?',
    answer: 'Dr. Priya Sharma charges ₹1,000 and Dr. Rohan Mehta charges ₹800. For procedures above ₹3,000 booked on the same day, 50% of the consultation fee is adjusted against your procedure bill.',
    category: 'PRICING',
    isApproved: true,
    viewCount: 142,
  });

  db.createFaq({
    clinicId: clinic.id,
    question: 'What are the pre-care instructions before a HydraFacial or Chemical Peel?',
    answer: 'Please avoid exfoliating scrubs, retinol, and AHAs/BHAs for 48 hours prior to your session. Avoid direct sun tanning and inform our doctor if you are on oral isotretinoin.',
    category: 'AFTERCARE',
    isApproved: true,
    viewCount: 98,
  });

  db.createFaq({
    clinicId: clinic.id,
    question: 'What is the cancellation and rescheduling policy?',
    answer: 'You can easily reschedule or cancel your appointment free of charge up to 4 hours before your slot via WhatsApp or phone. Booking deposits are 100% refundable with 4+ hours notice.',
    category: 'POLICIES',
    isApproved: true,
    viewCount: 84,
  });

  db.createFaq({
    clinicId: clinic.id,
    question: 'Is valet parking available at the clinic?',
    answer: 'Yes! Dedicated complimentary valet parking is available right in front of the clinic at 42, 100 Feet Road, Koramangala.',
    category: 'GENERAL',
    isApproved: true,
    viewCount: 65,
  });

  // 5. Knowledge Documents (RAG)
  db.createKnowledgeDocument({
    clinicId: clinic.id,
    title: 'DermaCare Clinical Safety Protocols & Doctor Schedules',
    category: 'DOCTORS',
    content: `DermaCare Clinic operates Monday through Saturday from 9:00 AM to 8:00 PM, and Sunday from 10:00 AM to 4:00 PM.
Dr. Priya Sharma (MBBS, MD Dermatology) is available Monday to Saturday 10:00 AM to 6:00 PM. Specializes in Acne, Scar Revision, and Anti-Aging.
Dr. Rohan Mehta (MBBS, DVD, FAM) is available Monday to Saturday 10:00 AM to 6:00 PM. Specializes in Laser Hair Reduction, PRP, and Melasma.
All medical procedures strictly require patch tests where applicable. We use only US-FDA approved laser and injection devices.`,
    chunkCount: 3,
    status: 'READY',
    version: 1,
  });

  db.createKnowledgeDocument({
    clinicId: clinic.id,
    title: 'Comprehensive Treatment Pricing & Advance Booking Policy',
    category: 'PRICING',
    content: `HydraFacial MD Elite Glow is priced at ₹3,500 per session. Package of 3 is ₹9,000.
Triple-Wavelength Laser Hair Reduction starts at ₹4,500 per session for underarms/face, and ₹12,000 for full body.
GFC / PRP Hair Therapy is ₹5,000 per session.
Chemical Peels start at ₹2,200.
Advance booking deposit of ₹500 via Razorpay or UPI is requested to hold exclusive doctor slots and is 100% refundable up to 4 hours prior.`,
    chunkCount: 2,
    status: 'READY',
    version: 1,
  });

  // 6. Sample Leads
  const lead1 = db.createLead({
    clinicId: clinic.id,
    name: 'Ananya Roy',
    phone: '+91 98450 11223',
    email: 'ananya.roy@example.com',
    source: 'WHATSAPP',
    status: 'APPOINTMENT_BOOKED',
    primaryConcern: 'HydraFacial for wedding glow',
    interestedServiceId: svcHydra.id,
    preferredDoctorId: doc1.id,
    budgetEstimated: 3500,
    tags: ['HydraFacial', 'Bridal', 'High Intent'],
    notes: 'Inquired for glowing skin before weekend event. Booked slot with Dr. Priya.',
    lastContactedAt: new Date().toISOString(),
  });

  const lead2 = db.createLead({
    clinicId: clinic.id,
    name: 'Rahul Verma',
    phone: '+91 99160 44556',
    email: 'rahul.v@example.com',
    source: 'WHATSAPP',
    status: 'QUALIFIED',
    primaryConcern: 'Hair thinning at crown area',
    interestedServiceId: svcPRP.id,
    preferredDoctorId: doc2.id,
    budgetEstimated: 5000,
    tags: ['Hair Loss', 'PRP Inquiry'],
    notes: 'Looking for 3-session hair restoration package. Shared doctor schedule.',
    lastContactedAt: new Date().toISOString(),
  });

  const lead3 = db.createLead({
    clinicId: clinic.id,
    name: 'Pooja Patel',
    phone: '+91 97310 77889',
    source: 'INSTAGRAM',
    status: 'CONTACTED',
    primaryConcern: 'Persistent cystic acne and dark spots',
    interestedServiceId: svcAcnePeel.id,
    tags: ['Acne', 'Chemical Peel'],
    lastContactedAt: new Date().toISOString(),
  });

  // 7. Sample Appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split('T')[0];

  const apt1 = db.createAppointment({
    clinicId: clinic.id,
    leadId: lead1.id,
    leadName: lead1.name,
    leadPhone: lead1.phone,
    doctorId: doc1.id,
    doctorName: doc1.name,
    serviceId: svcHydra.id,
    serviceName: svcHydra.name,
    date: tomorrowStr,
    startTime: '11:00',
    endTime: '11:45',
    durationMinutes: 45,
    consultationFee: doc1.consultationFee,
    depositPaid: 500,
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
    bookedVia: 'WHATSAPP_AI',
    notes: 'Automated booking completed via WhatsApp AI assistant with Razorpay deposit verification.',
  });

  const apt2 = db.createAppointment({
    clinicId: clinic.id,
    leadId: lead2.id,
    leadName: lead2.name,
    leadPhone: lead2.phone,
    doctorId: doc2.id,
    doctorName: doc2.name,
    serviceId: svcPRP.id,
    serviceName: svcPRP.name,
    date: dayAfterStr,
    startTime: '15:00',
    endTime: '16:00',
    durationMinutes: 60,
    consultationFee: doc2.consultationFee,
    depositPaid: 0,
    paymentStatus: 'UNPAID',
    status: 'BOOKED',
    bookedVia: 'DASHBOARD_STAFF',
    notes: 'Consultation + Hair scan session scheduled by receptionist.',
  });

  // 8. Sample Conversation & Messages for Ananya Roy
  const conv1 = db.createConversation({
    clinicId: clinic.id,
    leadId: lead1.id,
    patientPhone: lead1.phone,
    patientName: lead1.name,
    state: 'COMPLETED',
    mode: 'AI',
    lastIntent: 'APPOINTMENT_BOOKING',
    unreadCount: 0,
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: 'Your HydraFacial appointment is confirmed with Dr. Priya Sharma!',
  });

  db.createMessage({
    conversationId: conv1.id,
    direction: 'INBOUND',
    sender: 'PATIENT',
    senderName: 'Ananya Roy',
    content: 'Hi! What are the charges for HydraFacial and is Dr. Priya available tomorrow morning?',
    status: 'READ',
  });

  db.createMessage({
    conversationId: conv1.id,
    direction: 'OUTBOUND',
    sender: 'AI',
    senderName: 'Dermo AI',
    content: 'Hello Ananya! 👋 Our **HydraFacial MD Elite Glow** is ₹3,500 (45 mins session). Yes, Dr. Priya Sharma is available tomorrow. We have slots at **10:30 AM**, **11:00 AM**, and **11:30 AM**. Would you like me to reserve the 11:00 AM slot for you?',
    interactiveType: 'quick_reply',
    interactiveOptions: [
      { id: 'opt_11am', title: 'Book 11:00 AM' },
      { id: 'opt_1130am', title: 'Book 11:30 AM' },
      { id: 'opt_more_info', title: 'Tell me benefits' },
    ],
    status: 'DELIVERED',
  });

  db.createMessage({
    conversationId: conv1.id,
    direction: 'INBOUND',
    sender: 'PATIENT',
    senderName: 'Ananya Roy',
    content: 'Yes please book 11:00 AM slot!',
    status: 'READ',
  });

  db.createMessage({
    conversationId: conv1.id,
    direction: 'OUTBOUND',
    sender: 'AI',
    senderName: 'Dermo AI',
    content: `✅ Done! Your **HydraFacial** with **Dr. Priya Sharma** is reserved for **Tomorrow at 11:00 AM** at DermaCare Clinic, Koramangala. A confirmation SMS & WhatsApp reminder have been dispatched. See you tomorrow!`,
    status: 'DELIVERED',
  });

  // 9. Sample Payments (Razorpay)
  db.createPayment({
    orderId: 'order_derma_sample_01',
    clinicId: clinic.id,
    leadId: lead1.id,
    appointmentId: apt1.id,
    amount: 50000, // 500 INR in paise
    currency: 'INR',
    receipt: 'rcpt_ananya_01',
    status: 'CAPTURED',
    paymentId: 'pay_rzp_mock_ananya123',
    description: 'HydraFacial Advance Slot Deposit',
    customerName: lead1.name,
    customerEmail: lead1.email,
    customerPhone: lead1.phone,
  });

  // 10. Audit Logs
  db.createAuditLog({
    clinicId: clinic.id,
    action: 'INITIAL_SEED',
    entityType: 'CLINIC',
    entityId: clinic.id,
    details: { message: 'Clinic database initialized with seed catalog.' },
  });

  db.createAuditLog({
    clinicId: clinic.id,
    action: 'APPOINTMENT_CONFIRMED',
    entityType: 'APPOINTMENT',
    entityId: apt1.id,
    details: { doctor: doc1.name, service: svcHydra.name, date: tomorrowStr, time: '11:00' },
  });

  console.log('✅ Database seeded successfully with Clinic, 2 Doctors, 5 Services, 4 FAQs, 2 Leads, 2 Appointments, 1 Conversation, and Razorpay records.');
}

// Auto-seed if called directly
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase();
}
