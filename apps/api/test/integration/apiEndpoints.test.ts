import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../src/app';
import { Server } from 'http';

describe('Integration Tests: Express REST API Endpoints', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('GET /health should return 200 and healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const json = await res.json() as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.status, 'healthy');
    assert.strictEqual(json.service, 'Dermo Clinic API');
  });

  it('GET /api/v1/clinic should return clinic profile and working hours', async () => {
    const res = await fetch(`${baseUrl}/api/v1/clinic`);
    const json = await res.json() as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.name, 'DermaCare Aesthetic & Dermatology Clinic');
  });

  it('GET /api/v1/doctors should return doctor list', async () => {
    const res = await fetch(`${baseUrl}/api/v1/doctors`);
    const json = await res.json() as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 2);
  });

  it('GET /api/v1/services should return treatments catalog', async () => {
    const res = await fetch(`${baseUrl}/api/v1/services`);
    const json = await res.json() as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 5);
  });

  it('GET /api/v1/analytics/overview should return live clinic KPIs', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/overview`);
    const json = await res.json() as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.enquiries >= 0);
    assert.ok(json.data.qualifiedLeads >= 0);
    assert.ok(json.data.conversionRate !== undefined);
  });

  it('POST /api/v1/whatsapp/simulator should respond with AI reply', async () => {
    const res = await fetch(`${baseUrl}/api/v1/whatsapp/simulator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+919988771122',
        name: 'API Test User',
        message: 'What is the price of HydraFacial?',
      }),
    });

    const json = await res.json() as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.userMessage);
    assert.ok(json.data.aiMessage);
    assert.ok(json.data.aiMessage.content.includes('HydraFacial') || json.data.aiMessage.content.includes('3,500'));
  });
});
