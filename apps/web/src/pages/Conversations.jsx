import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, User, Sparkles, UserCheck, Send,
  RefreshCw, Search, Bot, ChevronRight, Phone, Clock,
} from 'lucide-react';
import { api } from '../services/api.js';

function StatusBadge({ status }) {
  const isPaused = status === 'PAUSED';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
        isPaused
          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/35'
          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`}
      />
      {isPaused ? 'Human' : 'AI'}
    </span>
  );
}

export function Conversations() {
  const [conversations, setConversations]   = useState([]);
  const [selectedId,    setSelectedId]      = useState(null);
  const [activeConvData, setActiveConvData] = useState(null);
  const [replyText,     setReplyText]       = useState('');
  const [loading,       setLoading]         = useState(true);
  const [sending,       setSending]         = useState(false);
  const [search,        setSearch]          = useState('');
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedConversation = async (id) => {
    if (!id) return;
    try {
      const data = await api.getConversation(id);
      setActiveConvData(data);
    } catch (err) {
      console.error('Failed to load conversation details', err);
    }
  };

  useEffect(() => {
    loadConversations();
    const t = setInterval(loadConversations, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (selectedId) loadSelectedConversation(selectedId); }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvData]);

  const handleTakeover = async () => {
    if (!selectedId) return;
    await api.takeoverConversation(selectedId);
    await loadSelectedConversation(selectedId);
    await loadConversations();
  };
  const handleRelease = async () => {
    if (!selectedId) return;
    await api.releaseConversation(selectedId);
    await loadSelectedConversation(selectedId);
    await loadConversations();
  };
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId || sending) return;
    setSending(true);
    try {
      await api.sendStaffMessage(selectedId, replyText.trim());
      setReplyText('');
      await loadSelectedConversation(selectedId);
      await loadConversations();
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const conv         = activeConvData?.conversation;
  const messages     = activeConvData?.messages     || [];
  const lead         = activeConvData?.lead;
  const appointments = activeConvData?.appointments || [];
  const handoffs     = activeConvData?.handoffs     || [];

  const filtered = conversations.filter(c =>
    (c.patient_name || c.patient_phone || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="rounded-2xl border border-white/5 overflow-hidden flex flex-col"
      style={{
        height: 'calc(100vh - 8.5rem)',
        minHeight: '520px',
        background: '#06090f',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">

        {/* ── Conversation List ── */}
        <div
          className="md:col-span-4 flex flex-col h-full"
          style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(4,6,12,0.8)' }}
        >
          {/* List Header */}
          <div
            className="p-3.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="font-bold text-[11px] text-white tracking-tight">Patient Inbox</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                {conversations.length}
              </span>
            </div>
            <button
              onClick={loadConversations}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-full bg-dark-850/80 text-white border border-dark-700 rounded-xl pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/40 placeholder-slate-600 transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-white/[0.03]">
            {loading ? (
              <div className="p-8 text-center text-slate-600 text-xs">Loading chats…</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-xs">No conversations found</div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.id === selectedId;
                const isPaused   = item.ai_status === 'PAUSED';
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-l-2 border-emerald-500 bg-emerald-950/25'
                        : 'border-l-2 border-transparent hover:bg-white/3'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 relative"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, #22c55e, #4ade80)'
                            : 'linear-gradient(135deg, #1a2435, #202d42)',
                          color: isSelected ? 'black' : '#94a3b8',
                        }}
                      >
                        {(item.patient_name || 'P').charAt(0).toUpperCase()}
                        {isPaused && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border border-dark-950 flex items-center justify-center">
                            <User className="w-1.5 h-1.5 text-white" />
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`font-bold text-[11px] truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {item.patient_name || item.patient_phone}
                          </span>
                          <span className="text-[9px] text-slate-600 font-mono shrink-0 ml-1">
                            {new Date(item.updated_at || item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mb-1.5">{item.last_message || 'No messages'}</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          <StatusBadge status={item.ai_status} />
                          {item.last_intent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-dark-750 text-slate-400 border border-white/5">
                              {item.last_intent}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div className="md:col-span-8 flex flex-col lg:flex-row h-full">
          <div
            className="flex-1 flex flex-col"
            style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}
          >
            {conv ? (
              <>
                {/* Chat Top Bar */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(4,6,12,0.6)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center text-black"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', boxShadow: '0 0 14px rgba(34,197,94,0.35)' }}
                    >
                      {conv.patient_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-[11px] text-white leading-tight">{conv.patient_name}</h4>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{conv.patient_phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {conv.ai_status === 'ACTIVE' ? (
                      <button
                        onClick={handleTakeover}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1.5 transition-all"
                        style={{ boxShadow: '0 0 14px rgba(225,29,72,0.25)' }}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Pause AI
                      </button>
                    ) : (
                      <button
                        onClick={handleRelease}
                        className="btn-glow px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-[10px] flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Resume Derma AI
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar chat-dark-bg">
                  {messages.map((m, idx) => {
                    const isCustomer = m.sender === 'CUSTOMER';
                    const isAI = m.sender === 'AI';
                    return (
                      <div key={idx} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs ${
                            isCustomer
                              ? 'rounded-tl-sm'
                              : isAI
                              ? 'rounded-tr-sm'
                              : 'rounded-tr-sm'
                          }`}
                          style={
                            isCustomer
                              ? { background: '#18222d', border: '1px solid rgba(255,255,255,0.07)', color: '#e2e8f0' }
                              : isAI
                              ? { background: '#003d35', border: '1px solid rgba(34,197,94,0.25)', color: '#a7f3d0', boxShadow: '0 0 20px rgba(0,100,80,0.15)' }
                              : { background: '#22c55e', color: 'black', fontWeight: 600, boxShadow: '0 0 14px rgba(34,197,94,0.3)' }
                          }
                        >
                          {/* Sender label */}
                          <div className="flex items-center gap-1 mb-1.5 opacity-70 text-[9px] font-extrabold uppercase tracking-wide">
                            {isCustomer ? (
                              <><Phone className="w-2.5 h-2.5" />{conv.patient_name}</>
                            ) : isAI ? (
                              <><Sparkles className="w-2.5 h-2.5" />Derma AI</>
                            ) : (
                              <><User className="w-2.5 h-2.5" />Staff Reply</>
                            )}
                          </div>
                          <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                          <span className="block text-[9px] text-right mt-1.5 opacity-50 font-mono">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Reply Bar */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 flex items-center gap-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(4,6,12,0.6)' }}
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={
                      conv.ai_status === 'ACTIVE'
                        ? 'Type to send manual staff message (AI active)…'
                        : 'Type message to patient on WhatsApp…'
                    }
                    className="flex-1 input-dark text-[11px]"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="btn-glow px-4 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-[11px] flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-600">
                <div className="w-14 h-14 rounded-2xl bg-dark-850 border border-white/5 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-xs font-medium">Select a conversation to view messages</p>
              </div>
            )}
          </div>

          {/* ── Patient Context Sidebar ── */}
          {conv && (
            <div
              className="w-full lg:w-64 flex flex-col overflow-y-auto no-scrollbar"
              style={{ background: 'rgba(4,6,12,0.8)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div
                className="px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}
              >
                <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest">Patient Context</p>
              </div>

              <div className="p-3 space-y-3">
                {/* Profile */}
                <div className="p-3 rounded-xl bg-dark-900/80 border border-white/5 space-y-2">
                  <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-wider">Profile</p>
                  <div className="space-y-1.5">
                    {[
                      { k: 'Name',     v: conv.patient_name },
                      { k: 'Phone',    v: conv.patient_phone, mono: true },
                      { k: 'AI State', v: conv.stage },
                    ].map(row => (
                      <div key={row.k} className="flex justify-between items-center gap-1">
                        <span className="text-[10px] text-slate-500">{row.k}</span>
                        <span className={`text-[10px] font-bold text-right truncate max-w-[55%] ${row.mono ? 'text-emerald-400 font-mono' : 'text-slate-200'}`}>
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead */}
                {lead && (
                  <div className="p-3 rounded-xl bg-dark-900/80 border border-white/5 space-y-2">
                    <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-wider">Lead</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">Service</span>
                        <span className="text-[10px] font-bold text-slate-200 truncate max-w-[55%]">{lead.service}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">Status</span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appointments */}
                {appointments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-wider px-0.5">Appointments</p>
                    {appointments.map(a => (
                      <div key={a.id} className="p-3 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] text-slate-200 truncate">{a.service_name}</span>
                          <span className="text-[9px] font-extrabold text-emerald-400">{a.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">{a.date} · {a.time}</p>
                        <p className="text-[10px] text-slate-600">{a.doctor_name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Handoffs */}
                {handoffs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider px-0.5">⚠ Handoff Alerts</p>
                    {handoffs.map(h => (
                      <div key={h.id} className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[10px] space-y-1">
                        <span className="font-extrabold text-rose-400 text-[9px] uppercase">Reason</span>
                        <p className="text-rose-200 leading-relaxed">{h.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Conversations;
