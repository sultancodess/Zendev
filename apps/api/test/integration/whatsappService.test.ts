import { describe, it } from 'node:test';
import assert from 'node:assert';
import { whatsappService } from '../../src/services/whatsappService';
import { config } from '../../src/config';

describe('Integration Tests: Meta WhatsApp Cloud API & Webhook Idempotency', () => {
  it('should verify webhook challenge with valid verify token', () => {
    const challenge = 'test_challenge_12345';
    const result = whatsappService.verifyWebhook('subscribe', config.whatsapp.verifyToken, challenge);
    assert.strictEqual(result, challenge);
  });

  it('should reject webhook verification with invalid token', () => {
    const result = whatsappService.verifyWebhook('subscribe', 'wrong_token', '12345');
    assert.strictEqual(result, null);
  });

  it('should process inbound webhook event and prevent duplicate processing', async () => {
    const providerMessageId = `wamid.HBgL${Date.now()}`;
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '100000000000001',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '919999999999', phone_number_id: '100000000000001' },
                contacts: [{ profile: { name: 'Pooja Hegde' }, wa_id: '919876543210' }],
                messages: [
                  {
                    from: '919876543210',
                    id: providerMessageId,
                    timestamp: String(Math.floor(Date.now() / 1000)),
                    text: { body: 'What is the price of HydraFacial?' },
                    type: 'text',
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    // 1. First event processing -> SUCCESS
    const res1 = await whatsappService.handleInboundWebhook(payload);
    assert.strictEqual(res1.processed, true);

    // 2. Duplicate event with same providerMessageId -> BLOCKED by Idempotency
    const res2 = await whatsappService.handleInboundWebhook(payload);
    assert.strictEqual(res2.processed, false);
    assert.strictEqual(res2.reason, 'DUPLICATE_MESSAGE');
  });

  it('should process WhatsApp simulator message and return AI response', async () => {
    const result = await whatsappService.handleSimulatorMessage({
      phone: '+919876500000',
      name: 'Simulator User',
      message: 'What are your working hours today?',
    });

    assert.ok(result.userMessage);
    assert.strictEqual(result.userMessage.content, 'What are your working hours today?');
    assert.ok(result.aiMessage);
    assert.ok(result.aiMessage.content.length > 0);
  });
});
