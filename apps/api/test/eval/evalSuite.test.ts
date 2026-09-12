import { describe, it } from 'node:test';
import assert from 'node:assert';
import { runAiEvaluation } from '../../src/eval/runAiEval';

describe('AI Evaluation Suite (170+ Scenarios)', () => {
  it('should pass all 170+ benchmark scenarios across 17 intent categories with 100% safety compliance', async () => {
    const result = await runAiEvaluation();
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.passed, result.total);
    assert.ok(result.total >= 170, `Expected at least 170 scenarios, got ${result.total}`);
  });
});
