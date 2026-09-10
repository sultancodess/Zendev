import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config';
import { db } from '../database/db';
import { RazorpayOrder, PaymentVerificationPayload } from '@dermo/types';
import { AppError } from '../middleware/errorHandler';

export class PaymentService {
  private static instance: PaymentService;
  private razorpayClient: Razorpay | null = null;

  private constructor() {
    if (config.razorpay.keyId && config.razorpay.keySecret && !config.razorpay.keyId.includes('sample')) {
      try {
        this.razorpayClient = new Razorpay({
          key_id: config.razorpay.keyId,
          key_secret: config.razorpay.keySecret,
        });
      } catch (err) {
        console.warn('⚠️ Razorpay client initialization error, falling back to simulated gateway mode.');
      }
    }
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Create Razorpay Order
  async createOrder(params: {
    leadId: string;
    amount: number; // in INR or base units
    currency?: string;
    appointmentId?: string;
    description?: string;
  }): Promise<RazorpayOrder> {
    const { leadId, amount, currency = 'INR', appointmentId, description = 'Appointment Booking Deposit' } = params;
    const lead = db.getLeadById(leadId);
    if (!lead) throw new AppError('Lead not found', 404, 'NOT_FOUND');

    const amountInPaise = Math.round(amount * 100);
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    let razorpayOrderId = `order_sim_${Date.now()}`;

    if (this.razorpayClient) {
      try {
        const order = await this.razorpayClient.orders.create({
          amount: amountInPaise,
          currency,
          receipt,
          notes: {
            leadId,
            appointmentId: appointmentId || '',
          },
        });
        razorpayOrderId = order.id;
      } catch (err: any) {
        console.warn('⚠️ Razorpay API order creation failed, using simulated order ID:', err.message);
      }
    }

    const orderRecord = db.createPayment({
      orderId: razorpayOrderId,
      clinicId: db.getClinic().id,
      leadId: lead.id,
      appointmentId,
      amount: amountInPaise,
      currency,
      receipt,
      status: 'CREATED',
      description,
      customerName: lead.name,
      customerEmail: lead.email,
      customerPhone: lead.phone,
    });

    db.createAuditLog({
      clinicId: db.getClinic().id,
      action: 'PAYMENT_ORDER_CREATED',
      entityType: 'PAYMENT',
      entityId: orderRecord.id,
      details: { orderId: razorpayOrderId, amount: amountInPaise, lead: lead.name },
    });

    return orderRecord;
  }

  // Verify Razorpay Payment Signature
  verifySignature(payload: PaymentVerificationPayload): boolean {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

    // In local dev/simulated mode
    if (!this.razorpayClient || config.razorpay.keySecret.includes('sample')) {
      const order = db.getPaymentByOrderId(razorpay_order_id);
      if (order) {
        db.updatePayment(order.id, {
          status: 'CAPTURED',
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        });
        if (order.appointmentId) {
          db.updateAppointment(order.appointmentId, {
            paymentStatus: 'PAID',
            depositPaid: order.amount / 100,
          });
        }
      }
      return true;
    }

    // Live HMAC SHA256 Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      const order = db.getPaymentByOrderId(razorpay_order_id);
      if (order) {
        db.updatePayment(order.id, {
          status: 'CAPTURED',
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        });
        if (order.appointmentId) {
          db.updateAppointment(order.appointmentId, {
            paymentStatus: 'PAID',
            depositPaid: order.amount / 100,
          });
        }
      }
    }

    return isValid;
  }
}

export const paymentService = PaymentService.getInstance();
