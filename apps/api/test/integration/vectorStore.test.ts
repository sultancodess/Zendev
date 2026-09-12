import { describe, it } from 'node:test';
import assert from 'node:assert';
import { vectorStore } from '../../src/ai/vectorStore';
import { ragEngine } from '../../src/ai/ragEngine';

describe('Integration Tests: Vector Store Indexing & RAG Retrieval', () => {
  it('should index knowledge chunk and retrieve via similarity search', async () => {
    const docId = 'doc_test_100';
    const content = 'DermaCare clinic offers complimentary valet parking directly in front of the Koramangala branch.';
    
    await vectorStore.indexChunk(docId, content, {
      title: 'Valet Parking Facilities',
      category: 'CLINIC_FACILITIES',
      clinicId: 'clinic_1',
      version: 1,
    });

    const results = await vectorStore.search('Is parking available at the clinic?', 3);
    assert.ok(results.length > 0);
    assert.ok(results[0].chunk.content.includes('valet parking'));
  });

  it('should generate grounded RAG answer based on retrieved context', async () => {
    const groundedAnswer = await ragEngine.generateGroundedAnswer('What are the qualifications of Dr. Priya Sharma?');
    assert.ok(groundedAnswer.length > 0);
    assert.ok(groundedAnswer.includes('Dr. Priya') || groundedAnswer.includes('Dermatology'));
  });
});
