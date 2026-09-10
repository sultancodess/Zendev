'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  FileText,
  Trash2,
  Layers,
  Database,
} from 'lucide-react';
import { api } from '@/lib/api';
import { FAQ, KnowledgeDocument } from '@dermo/types';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'faqs' | 'docs'>('faqs');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  // Modals
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  // FAQ Form
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCat, setFaqCat] = useState('GENERAL');

  // Doc Form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'SERVICES' | 'POLICIES' | 'AFTERCARE' | 'PRICING' | 'DOCTORS' | 'GENERAL'>('GENERAL');
  const [docContent, setDocContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [fData, dData] = await Promise.all([api.getFaqs(), api.getKnowledgeDocs()]);
      setFaqs(fData);
      setDocs(dData);
    } catch (err) {
      console.error('Failed to load knowledge:', err);
    }
  }

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ || !faqA) return;
    try {
      await api.createFaq({ question: faqQ, answer: faqA, category: faqCat, isApproved: true });
      setShowFaqModal(false);
      setFaqQ('');
      setFaqA('');
      await loadData();
    } catch (err) {
      console.error('Failed to create FAQ:', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await api.deleteFaq(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;
    try {
      await api.createKnowledgeDoc({ title: docTitle, category: docCategory, content: docContent });
      setShowDocModal(false);
      setDocTitle('');
      setDocContent('');
      await loadData();
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  const handleReindex = async (docId: string) => {
    setReindexingId(docId);
    try {
      await api.reindexDoc(docId);
      await loadData();
    } catch (err) {
      console.error('Reindexing failed:', err);
    } finally {
      setReindexingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Clinic Knowledge Base & Grounded FAQs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Approved answers and vectorized documents used by LangChain & pgvector for zero-hallucination responses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'faqs' ? (
            <button
              onClick={() => setShowFaqModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          ) : (
            <button
              onClick={() => setShowDocModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approved FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>pgvector RAG Documents ({docs.length})</span>
        </button>
      </div>

      {/* Tab 1: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-white">{faq.question}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/30 whitespace-nowrap">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {faq.answer}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Viewed by AI {faq.viewCount || 0} times</span>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: RAG Documents */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">{doc.title}</h3>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Category: {doc.category} • Version: {doc.version}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        doc.status === 'READY'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : doc.status === 'PROCESSING'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {doc.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{doc.chunkCount || 1} pgvector chunks</span>
                  </span>

                  <button
                    onClick={() => handleReindex(doc.id)}
                    disabled={reindexingId === doc.id}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${reindexingId === doc.id ? 'animate-spin' : ''}`} />
                    <span>{reindexingId === doc.id ? 'Embedding...' : 'Re-index with Gemini'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-700 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Add Approved Clinic FAQ</h3>
            <form onSubmit={handleCreateFaq} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  placeholder="e.g. Can I wear makeup after HydraFacial?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={faqCat}
                  onChange={(e) => setFaqCat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="PRICING">Pricing & Payments</option>
                  <option value="AFTERCARE">Pre & Post Care</option>
                  <option value="POLICIES">Clinic Policies</option>
                  <option value="DOCTORS">Doctor Schedules</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Answer *</label>
                <textarea
                  required
                  rows={3}
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  placeholder="Doctor approved factual answer..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-slate-700 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Upload Knowledge Document to RAG</h3>
            <form onSubmit={handleCreateDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Soprano Titanium Laser Protocol & Instructions"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="SERVICES">Services & Protocols</option>
                  <option value="AFTERCARE">Pre & Post Care</option>
                  <option value="PRICING">Pricing & Packages</option>
                  <option value="POLICIES">Policies</option>
                  <option value="DOCTORS">Doctors</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Document Content *</label>
                <textarea
                  required
                  rows={5}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Full text content to be chunked and vectorized..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Vectorize & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
