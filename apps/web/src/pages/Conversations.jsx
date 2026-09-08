import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Search, RefreshCw, Send,
  UserCheck, Sparkles, User, Phone,
} from 'lucide-react';
import { api } from '../services/api.js';

function AiStatusBadge({ status }) {
  const paused = status === 'PAUSED';
  return (
    <span
      className="tag"
      style={{ background: paused ? '#fee2e2' : '#dcfce7', color: paused ? '#991b1b' : '#15803d', fontSize: 10 }}
    >
      {paused ? 'Human' : 'AI Active'}
    </span>
  );
}

export function Conversations() {
  const [conversations,  setConversations]  = useState([]);
  const [selectedId,     setSelectedId]     = useState(null);
  const [activeConvData, setActiveConvData] = useState(null);
  const [replyText,      setReplyText]      = useState('');
  const [loading,        setLoading]        = useState(true);
  const [sending,        setSending]        = useState(false);
  const [search,         setSearch]         = useState('');
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadSelected = async (id) => {
    if (!id) return;
    try { setActiveConvData(await api.getConversation(id)); } catch (err) { console.error(err); }
  };

  useEffect(() => {
    loadConversations();
    const t = setInterval(loadConversations, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (selectedId) loadSelected(selectedId); }, [selectedId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeConvData]);

  const handleTakeover = async () => { await api.takeoverConversation(selectedId); await loadSelected(selectedId); await loadConversations(); };
  const handleRelease  = async () => { await api.releaseConversation(selectedId);  await loadSelected(selectedId); await loadConversations(); };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId || sending) return;
    setSending(true);
    try { await api.sendStaffMessage(selectedId, replyText.trim()); setReplyText(''); await loadSelected(selectedId); await loadConversations(); }
    catch (err) { alert('Failed: ' + err.message); }
    finally { setSending(false); }
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
    <div>
      {/* Title */}
      <div className="mb-4">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Chat Inbox</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Live WhatsApp conversations managed by Derma AI</p>
      </div>

      <div
        className="panel overflow-hidden flex"
        style={{ height: 'calc(100vh - 11rem)', minHeight: 500 }}
      >
        {/* ── List ── */}
        <div
          className="flex flex-col"
          style={{ width: 260, flexShrink: 0, borderRight: '1px solid #e5e7eb' }}
        >
          {/* List header */}
          <div className="px-3 py-3" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between mb-2.5">
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>
                Conversations <span style={{ color: '#9ca3af', fontWeight: 500 }}>({conversations.length})</span>
              </span>
              <button onClick={loadConversations} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <RefreshCw style={{ width: 12, height: 12 }} />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#9ca3af' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="input-base"
                style={{ paddingLeft: 28, fontSize: 12, height: 32 }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-6 text-center" style={{ fontSize: 12, color: '#9ca3af' }}>Loading…</div>
            ) : filtered.map(item => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className="w-full text-left px-3 py-3 transition-colors"
                  style={{
                    borderBottom: '1px solid #f9fafb',
                    background: isSelected ? '#f0fdf4' : 'transparent',
                    borderLeft: isSelected ? '3px solid #22c55e' : '3px solid transparent',
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>
                      {item.patient_name || item.patient_phone}
                    </span>
                    <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace', flexShrink: 0, marginLeft: 4 }}>
                      {new Date(item.updated_at || item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.last_message || 'No messages'}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <AiStatusBadge status={item.ai_status} />
                    {item.last_intent && (
                      <span className="tag tag-gray" style={{ fontSize: 10 }}>{item.last_intent}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Chat ── */}
        <div className="flex flex-col flex-1 min-w-0">
          {conv ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e5e7eb' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: '#22c55e', fontSize: 12 }}
                  >
                    {(conv.patient_name || 'P').charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{conv.patient_name}</p>
                    <p style={{ fontSize: 11, color: '#22c55e', fontFamily: 'monospace' }}>{conv.patient_phone}</p>
                  </div>
                </div>
                <div>
                  {conv.ai_status === 'ACTIVE' ? (
                    <button onClick={handleTakeover} className="btn-ghost" style={{ fontSize: 11, color: '#dc2626', borderColor: '#fecaca' }}>
                      <UserCheck style={{ width: 12, height: 12 }} />
                      Pause AI
                    </button>
                  ) : (
                    <button onClick={handleRelease} className="btn-primary" style={{ fontSize: 11 }}>
                      <Sparkles style={{ width: 12, height: 12 }} />
                      Resume AI
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3"
                style={{ background: '#fafafa' }}
              >
                {messages.map((m, i) => {
                  const isCustomer = m.sender === 'CUSTOMER';
                  const isAI = m.sender === 'AI';
                  return (
                    <div key={i} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className="max-w-xs px-3.5 py-2.5 rounded-2xl"
                        style={{
                          background: isCustomer ? '#ffffff' : isAI ? '#111111' : '#22c55e',
                          color: isCustomer ? '#111' : '#ffffff',
                          border: isCustomer ? '1px solid #e5e7eb' : 'none',
                          fontSize: 12,
                          lineHeight: 1.5,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }}
                      >
                        <div className="flex items-center gap-1 mb-1" style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {isCustomer ? <><Phone style={{ width: 9, height: 9 }} />{conv.patient_name}</>
                           : isAI ? <><Sparkles style={{ width: 9, height: 9 }} />Derma AI</>
                           : <><User style={{ width: 9, height: 9 }} />Staff</>}
                        </div>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                        <p style={{ fontSize: 9, textAlign: 'right', marginTop: 4, opacity: 0.5, fontFamily: 'monospace' }}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply */}
              <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={conv.ai_status === 'ACTIVE' ? 'AI is responding (type to override)…' : 'Type message…'}
                  className="input-base flex-1"
                  style={{ height: 36, fontSize: 12 }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="btn-primary"
                  style={{ height: 36, padding: '0 16px', fontSize: 12, opacity: (!replyText.trim() || sending) ? 0.5 : 1 }}
                >
                  <Send style={{ width: 13, height: 13 }} />
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ color: '#9ca3af', fontSize: 13 }}>
              <div className="text-center">
                <MessageSquare style={{ width: 32, height: 32, margin: '0 auto 8px', opacity: 0.3 }} />
                <p>Select a conversation</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Context panel ── */}
        {conv && (
          <div
            className="flex-col overflow-y-auto no-scrollbar hidden lg:flex"
            style={{ width: 220, flexShrink: 0, borderLeft: '1px solid #e5e7eb', padding: 12 }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Patient Info</p>
            <div className="space-y-2 text-xs">
              {[['Name', conv.patient_name], ['Phone', conv.patient_phone], ['Stage', conv.stage]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span style={{ color: '#6b7280' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: k === 'Phone' ? '#22c55e' : '#111', fontFamily: k === 'Phone' ? 'monospace' : 'inherit', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
                </div>
              ))}
            </div>

            {lead && (
              <>
                <div className="my-3" style={{ height: 1, background: '#f3f4f6' }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Lead</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span style={{ color: '#6b7280' }}>Service</span><span style={{ fontWeight: 600, color: '#111', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.service}</span></div>
                  <div className="flex justify-between items-center"><span style={{ color: '#6b7280' }}>Status</span><span className="tag tag-green" style={{ fontSize: 9 }}>{lead.status}</span></div>
                </div>
              </>
            )}

            {appointments.length > 0 && (
              <>
                <div className="my-3" style={{ height: 1, background: '#f3f4f6' }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Appointments</p>
                {appointments.map(a => (
                  <div key={a.id} className="p-2.5 rounded-lg mb-2" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{a.service_name}</p>
                    <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2, fontFamily: 'monospace' }}>{a.date} · {a.time}</p>
                  </div>
                ))}
              </>
            )}

            {handoffs.length > 0 && (
              <>
                <div className="my-3" style={{ height: 1, background: '#f3f4f6' }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>⚠ Handoff</p>
                {handoffs.map(h => (
                  <div key={h.id} className="p-2.5 rounded-lg" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
                    <p style={{ fontSize: 10, color: '#991b1b' }}>{h.reason}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversations;
