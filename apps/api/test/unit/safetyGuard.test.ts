import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkSafety } from '../../src/ai/safetyGuard';

describe('Unit Tests: Medical Safety Guardrails & Emergency Detection', () => {
  it('should flag prescription medication requests as MEDICAL_NON_DIAGNOSTIC', () => {
    const queries = [
      'Can you prescribe me Isotretinoin 20mg for my cystic acne?',
      'What is the dosage of Tretinoin cream for wrinkles?',
      'Should I take Minoxidil 5% with Finasteride tablet for hair loss?',
      'Which antibiotic tablet should I take for skin boil?',
      'Can I take steroid Prednisone for skin allergy?',
      'What percentage of Hydroquinone cream should I apply on dark spots?',
    ];

    for (const q of queries) {
      const result = checkSafety(q);
      assert.strictEqual(result.isSafe, false, `Expected query to be flagged: ${q}`);
      assert.strictEqual(result.classification, 'MEDICAL_NON_DIAGNOSTIC');
      assert.ok(result.suggestedResponse);
    }
  });

  it('should flag emergency symptoms as EMERGENCY_ESCALATE', () => {
    const emergencyQueries = [
      'My face is swelling up fast and I am having difficulty breathing',
      'Help! Having a severe allergic reaction with throat closing',
      'Chemical burn on eyes after treatment, it is burning badly!',
      'I am bleeding heavily after a skin procedure done outside',
      'Patient experiencing anaphylaxis shock immediately after injection',
      'Emergency medical assistance needed right now!',
    ];

    for (const q of emergencyQueries) {
      const result = checkSafety(q);
      assert.strictEqual(result.isSafe, false, `Expected emergency flag: ${q}`);
      assert.strictEqual(result.classification, 'EMERGENCY_ESCALATE');
      assert.ok(result.reason?.includes('Emergency signal'));
    }
  });

  it('should allow normal clinic enquiries as SAFE', () => {
    const safeQueries = [
      'What are your consultation timings for tomorrow?',
      'How much does a HydraFacial treatment cost?',
      'Can I book an appointment with Dr. Priya Sharma on Saturday?',
      'Where is your clinic located in Koramangala?',
      'Do you accept UPI and credit card payments?',
      'What is the price of 6 sessions of laser hair reduction?',
    ];

    for (const q of safeQueries) {
      const result = checkSafety(q);
      assert.strictEqual(result.isSafe, true, `Expected query to be safe: ${q}`);
      assert.strictEqual(result.classification, 'SAFE');
    }
  });
});
