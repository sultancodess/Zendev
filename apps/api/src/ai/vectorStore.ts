import { GoogleGenAI } from '@google/genai';
import { config } from '../config';
import { db } from '../database/db';
import { KnowledgeChunk } from '@dermo/types';

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

export class VectorStore {
  private static instance: VectorStore;
  private aiClient: GoogleGenAI | null = null;

  private constructor() {
    if (config.geminiApiKey) {
      try {
        this.aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
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
        // Use Gemini Embeddings API
        const response = await this.aiClient.models.embedContent({
          model: config.geminiEmbeddingModel,
          contents: text,
        });
        if (response?.embedding?.values) {
          return response.embedding.values;
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
  async search(query: string, limit: number = 3, threshold: number = 0.4): Promise<SearchResult[]> {
    const queryVector = await this.generateEmbedding(query);
    const chunks = db.getKnowledgeChunks();

    const scored: SearchResult[] = chunks
      .map((chunk) => {
        const score = chunk.embedding ? this.cosineSimilarity(queryVector, chunk.embedding) : 0;
        return { chunk, score };
      })
      .filter((res) => res.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }
}

export const vectorStore = VectorStore.getInstance();
