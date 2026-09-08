import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  User,
  Phone,
  Calendar,
  Sparkles,
  UserCheck,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Radio,
  Zap
} from 'lucide-react';
import { api } from '../services/api.js';

export function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeConvData, setActiveConvData] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
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
    const timer = setInterval(loadConversations, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadSelectedConversation(selectedId);
    }
  }, [selectedId]);

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

  const conv = activeConvData?.conversation;
  const messages = activeConvData?.messages || [];
  const lead = activeConvData?.lead;
  const appointments = activeConvData?.appointments || [];
  const handoffs = activeConvData?.handoffs || [];

  return (
    <div className="bg-[#0A0F18] rounded-2xl border border-zinc-800/90 shadow-[0_4px_25px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[calc(100vh-8.5rem)] min-h-[520px]">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Left Column: Conversation List */}
        <div className="md:col-span-4 border-r border-zinc-800/80 flex flex-col h-full bg-[#070b12]">
          <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-black/30">
            <h3 className="font-bold text-xs text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>EvilChat Patient Inbox</span>
            </h3>
            <button
              onClick={loadConversations}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-850">
            {conversations.map((item) => {
              const isSelected = item.id === selectedId;
              const isPaused = item.ai_status === 'PAUSED';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-l-4 border-emerald-500 shadow-[inset_0_0_15px_rgba(34,197,94,0.08)]'
                      : 'hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white truncate">
                      {item.patient_name || item.patient_phone}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.updated_at || item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate mb-2">{item.last_message || 'No messages'}</p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isPaused
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isPaused ? '🔴 Human Active' : '🟢 AI Active'}
                    </span>
                    {item.last_intent && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-slate-300 border border-zinc-700">
                        {item.last_intent}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat & Patient Context */}
        <div className="md:col-span-8 flex flex-col lg:flex-row h-full">
          {/* Middle: Chat Messages */}
          <div className="flex-1 flex flex-col h-full border-r border-zinc-800/80">
            {conv ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-3.5 border-b border-zinc-800/80 bg-[#070b12] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      {conv.patient_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white leading-tight">{conv.patient_name}</h4>
                      <p className="text-[11px] text-emerald-400/80 font-mono">{conv.patient_phone}</p>
                    </div>
                  </div>

                  {/* Takeover / Release Controls */}
                  <div className="flex items-center gap-2">
                    {conv.ai_status === 'ACTIVE' ? (
                      <button
                        onClick={handleTakeover}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-[0_0_12px_rgba(225,29,72,0.3)] transition-all flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Take Over (Pause AI)</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleRelease}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Return to EvilChat AI</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 chat-dark-bg">
                  {messages.map((m, idx) => {
                    const isCustomer = m.sender === 'CUSTOMER';
                    const isAI = m.sender === 'AI';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-md text-xs ${
                            isCustomer
                              ? 'bg-[#18222d] text-slate-100 rounded-tl-none border border-zinc-700/80'
                              : isAI
                              ? 'bg-[#004d40]/90 text-emerald-100 rounded-tr-none border border-emerald-500/40 shadow-[0_0_15px_rgba(0,121,107,0.2)]'
                              : 'bg-emerald-500 text-black font-medium rounded-tr-none shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 opacity-85 text-[10px] font-bold">
                            {isCustomer ? (
                              <span className="text-slate-300">{conv.patient_name}</span>
                            ) : isAI ? (
                              <span className="flex items-center gap-1 text-emerald-300">
                                <Sparkles className="w-3 h-3" /> EvilChat Assistant
                              </span>
                            ) : (
                              <span className="text-black font-bold">Receptionist ({m.sender_name || 'Staff'})</span>
                            )}
                          </div>
                          <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                          <span className="block text-[9px] text-right mt-1 opacity-60 font-mono">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Bar */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-zinc-800/80 bg-[#070b12] flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      conv.ai_status === 'ACTIVE'
                        ? 'EvilChat AI is replying automatically (or type to send manual staff message)...'
                        : 'Type message to patient on WhatsApp...'
                    }
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-700 bg-zinc-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Select a conversation to inspect messages
              </div>
            )}
          </div>

          {/* Context Sidebar */}
          {conv && (
            <div className="w-full lg:w-72 bg-[#070b12] p-4 border-t lg:border-t-0 border-zinc-800/80 overflow-y-auto space-y-4">
              <div>
                <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Patient Profile</h5>
                <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name</span>
                    <span className="font-bold text-white">{conv.patient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone</span>
                    <span className="font-mono text-emerald-400">{conv.patient_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI State</span>
                    <span className="font-semibold text-emerald-400">{conv.stage}</span>
                  </div>
                </div>
              </div>

              {lead && (
                <div>
                  <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Lead Details</h5>
                  <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service</span>
                      <span className="font-bold text-white">{lead.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {appointments.length > 0 && (
                <div>
                  <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Appointments</h5>
                  <div className="space-y-2">
                    {appointments.map((a) => (
                      <div key={a.id} className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{a.service_name}</span>
                          <span className="text-[10px] text-emerald-400">{a.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {a.date} at {a.time} ({a.doctor_name})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {handoffs.length > 0 && (
                <div>
                  <h5 className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider mb-2">Handoff Alerts</h5>
                  <div className="space-y-2">
                    {handoffs.map((h) => (
                      <div key={h.id} className="bg-rose-950/40 p-3 rounded-xl border border-rose-500/40 text-xs space-y-1">
                        <span className="font-bold text-rose-300 text-[10px] uppercase">Reason</span>
                        <p className="text-rose-200 text-xs leading-relaxed">{h.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Conversations;
