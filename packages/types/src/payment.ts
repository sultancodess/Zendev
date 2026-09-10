export type PaymentStatus = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface RazorpayOrder {
  id: string;
  orderId: string; // Razorpay order_id (e.g. order_xyz123)
  clinicId: string;
  leadId: string;
  appointmentId?: string;
  amount: number; // in paise or base currency units
  currency: string;
  receipt: string;
  status: PaymentStatus;
  paymentId?: string; // Razorpay payment_id (e.g. pay_xyz123)
  signature?: string;
  description: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  notes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
