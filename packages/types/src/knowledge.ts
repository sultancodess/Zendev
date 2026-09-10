export type KnowledgeDocStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface FAQ {
  id: string;
  clinicId: string;
  question: string;
  answer: string;
  category: string;
  isApproved: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  clinicId: string;
  title: string;
  category: 'SERVICES' | 'POLICIES' | 'AFTERCARE' | 'PRICING' | 'DOCTORS' | 'GENERAL';
  content: string;
  chunkCount: number;
  status: KnowledgeDocStatus;
  version: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: {
    title: string;
    category: string;
    clinicId: string;
    version: number;
  };
}
