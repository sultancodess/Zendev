import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { db } from '../database/db';
import { KnowledgeChunk } from '@dermo/types';

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

export class VectorStore {
  private static instance: VectorStore;
  private aiClient: GoogleGenerativeAI | null = null;

  private constructor() {
    if (config.geminiApiKey) {
      try {
        this.aiClient = new GoogleGenerativeAI(config.geminiApiKey);
      } catch (err) {
        console.warn('⚠️ Could not initialize Gemini API client for embeddings, using fallback matcher.');
      }
    }
  }

  public static getInstance(): VectorStore {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore();
    }
    return VectorStore.instance;
  }

  // Generate vector embeddings
  async generateEmbedding(text: string): Promise<number[]> {
    if (this.aiClient && config.geminiApiKey) {
      try {
        const model = this.aiClient.getGenerativeModel({ model: config.geminiEmbeddingModel });
        const result = await model.embedContent(text);
        if (result?.embedding?.values) {
          return result.embedding.values;
        }
      } catch (e) {
        console.warn('⚠️ Gemini embedding call failed, falling back to local bag-of-words vectorizer.');
      }
    }
    return this.fallbackVector(text);
  }

  // Fallback term-frequency vectorizer
  private fallbackVector(text: string): number[] {
    const tokens = text.toLowerCase().match(/\w+/g) || [];
    const hashVector = new Array(64).fill(0);
    tokens.forEach((word) => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % 64;
      hashVector[idx] += 1;
    });
    // Normalize
    const norm = Math.sqrt(hashVector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return hashVector.map((v) => v / norm);
  }

  // Cosine Similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Index document chunk into vector store
  async indexChunk(documentId: string, content: string, metadata: any): Promise<KnowledgeChunk> {
    const embedding = await this.generateEmbedding(content);
    const chunk: KnowledgeChunk = {
      id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      documentId,
      content,
      embedding,
      metadata,
    };
    db.addKnowledgeChunks([chunk]);
    return chunk;
  }

  // Similarity Search for RAG
  async search(query: string, limit: number = 3, threshold: number = 0.15): Promise<SearchResult[]> {
    const queryVector = await this.generateEmbedding(query);
    const queryTokens = query.toLowerCase().match(/\w+/g) || [];
    const chunks = db.getKnowledgeChunks();

    const scored: SearchResult[] = chunks
      .map((chunk) => {
        const cosScore = chunk.embedding ? this.cosineSimilarity(queryVector, chunk.embedding) : 0;
        
        // Keyword overlap boost
        const contentLower = chunk.content.toLowerCase();
        let keywordMatches = 0;
        queryTokens.forEach((t) => {
          if (t.length > 2 && contentLower.includes(t)) keywordMatches++;
        });
        const keywordBoost = queryTokens.length > 0 ? (keywordMatches / queryTokens.length) * 0.5 : 0;
        
        const finalScore = cosScore + keywordBoost;
        return { chunk, score: finalScore };
      })
      .filter((res) => res.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }
}

export const vectorStore = VectorStore.getInstance();
