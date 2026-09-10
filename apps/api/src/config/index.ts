import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'super_secret_dermo_clinic_jwt_key_32chars!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Google Gemini AI & LangChain
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  geminiEmbeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',

  // Database & pgvector
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dermo_clinic',
  enablePgvector: process.env.ENABLE_PGVECTOR === 'true',

  // WhatsApp Business Cloud API
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '100000000000001',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAB_sample_access_token',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'clinic_whatsapp_webhook_secret_verify_token',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_sample_key_id',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'sample_razorpay_secret_key',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'sample_razorpay_webhook_secret',
    defaultDepositAmount: parseInt(process.env.CONSULTATION_DEPOSIT_AMOUNT || '500', 10),
  },

  // Clinic Defaults
  clinicDefaults: {
    name: process.env.DEFAULT_CLINIC_NAME || 'DermaCare Aesthetics & Laser Clinic',
    timezone: process.env.DEFAULT_CLINIC_TIMEZONE || 'Asia/Kolkata',
    phone: process.env.DEFAULT_CLINIC_PHONE || '+919876543210',
  }
};
