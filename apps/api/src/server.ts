import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`
  ✨ Dermo Clinic API Server is running!
  📡 URL: ${config.appUrl}
  🩺 Health: ${config.appUrl}/health
  📲 WhatsApp Webhook: ${config.appUrl}/api/v1/webhooks/whatsapp
  💳 Environment: ${config.nodeEnv}
  ⚡ LangChain & Gemini AI Engine: Active
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
