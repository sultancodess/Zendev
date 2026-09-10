'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Send,
  UserCheck,
  Bot,
  Sparkles,
  ShieldAlert,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatTime } from '@/lib/utils';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Simulator State
  const [simPhone, setSimPhone] = useState('+919845011223');
  const [simName, setSimName] = useState('Ananya Roy');
  const [simMessage, setSimMessage] = useState('');
  const [simSending, setSimSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const convs = await api.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !selectedConv) {
        setSelectedConv(convs[0]);
        loadMessages(convs[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(convId: string) {
    try {
      const msgs = await api.getMessages(convId);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  const handleSelectConv = (conv: any) => {
    setSelectedConv(conv);
    loadMessages(conv.id);
  };

  const handleSendStaffReply = async () => {
    if (!replyText.trim() || !selectedConv || actionLoading) return;
    setActionLoading(true);
    try {
      await api.sendStaffMessage(selectedConv.id, replyText);
      setReplyText('');
      await loadMessages(selectedConv.id);
      await loadConversations();
    } catch (err) {
      console.error('Staff reply failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTakeover = async () => {
    if (!selectedConv || actionLoading) return;
    setActionLoading(true);
    try {
      if (selectedConv.mode === 'HUMAN_TAKEOVER') {
        await api.releaseConversation(selectedConv.id);
      } else {
        await api.takeoverConversation(selectedConv.id);
      }
      // Refresh current conversation
      const updated = await api.getConversation(selectedConv.id);
      setSelectedConv(updated);
      await loadConversations();
    } catch (err) {
      console.error('Failed to toggle takeover:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Simulator Send Action
  const handleSendSimulatorMessage = async (textToSend?: string) => {
    const text = textToSend || simMessage;
    if (!text.trim() || simSending) return;
    setSimSending(true);
    try {
      await api.sendSimulatorMessage({
        phone: simPhone,
        name: simName,
        message: text,
      });
      if (!textToSend) setSimMessage('');
      await loadConversations();
      if (selectedConv) {
        await loadMessages(selectedConv.id);
      }
    } catch (err) {
      console.error('Simulator send failed:', err);
    } finally {
      setSimSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <span>Live WhatsApp Conversations & Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time chat monitor with 1-click Human Takeover and interactive phone simulator.
          </p>
        </div>

        <button
          onClick={() => {
            loadConversations();
            if (selectedConv) loadMessages(selectedConv.id);
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-2 border border-slate-700 self-start transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Chats</span>
        </button>
      </div>

      {/* 3-Column Layout: Conv List (3 cols) | Chat Stream (5 cols) | Simulator & Lead Info (4 cols) */}
      <div className="grid lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left: Conversation List (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 font-semibold text-xs text-slate-300">
            Active Chats ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              const isTakeover = conv.mode === 'HUMAN_TAKEOVER';
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-l-4 border-l-emerald-400'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate max-w-[120px]">
                      {conv.patientName}
                    </span>
                    {isTakeover ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30">
                        Staff
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                        AI
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {conv.lastMessagePreview || 'No messages yet.'}
                  </p>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                    <span className="font-mono">{conv.patientPhone}</span>
                    <span>{conv.state}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Active Chat Window (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl border border-slate-800 flex flex-col overflow-hidden bg-[#0c131a]">
          {selectedConv ? (
            <>
              {/* Chat Header with Takeover Toggle */}
              <div className="p-4 border-b border-slate-800 bg-[#141f28] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{selectedConv.patientName}</span>
                    <span className="text-xs font-normal text-slate-400 font-mono">
                      ({selectedConv.patientPhone})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>Status: <strong className="text-emerald-400">{selectedConv.state}</strong></span>
                    <span>•</span>
                    <span>Mode: <strong className="text-white">{selectedConv.mode}</strong></span>
                  </div>
                </div>

                {/* 1-Click Takeover / Release Button */}
                <button
                  onClick={handleToggleTakeover}
                  disabled={actionLoading}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    selectedConv.mode === 'HUMAN_TAKEOVER'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-rose-500/90 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }`}
                >
                  {selectedConv.mode === 'HUMAN_TAKEOVER' ? (
                    <>
                      <Bot className="w-3.5 h-3.5" />
                      <span>Return to AI</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Take Over</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0c131a]">
                {messages.map((msg) => {
                  const isPatient = msg.sender === 'PATIENT';
                  const isAI = msg.sender === 'AI';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isPatient ? 'items-start' : 'items-end'}`}
                    >
                      <div className="text-[9px] text-slate-400 mb-0.5 px-1">
                        {isPatient ? selectedConv.patientName : isAI ? '🤖 Dermo AI' : '👩‍💼 Receptionist'}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                          isPatient
                            ? 'bg-[#1e2a32] text-slate-100 rounded-tl-none border border-slate-700/60'
                            : isAI
                            ? 'bg-[#005c4b] text-white rounded-tr-none'
                            : 'bg-blue-600 text-white rounded-tr-none'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {/* Interactive Quick Reply Buttons */}
                        {msg.interactiveOptions && msg.interactiveOptions.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1.5">
                            {msg.interactiveOptions.map((opt: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-black/25 text-[10px] font-semibold border border-white/20"
                              >
                                {opt.title}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-[9px] text-slate-300 text-right mt-1 opacity-80">
                          {formatTime(new Date(msg.createdAt).toTimeString().substring(0, 5))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Staff Reply Bar */}
              <div className="p-3 border-t border-slate-800 bg-[#141f28] flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendStaffReply()}
                  placeholder={
                    selectedConv.mode === 'HUMAN_TAKEOVER'
                      ? 'Type manual WhatsApp reply as Receptionist...'
                      : 'Take over conversation to reply manually...'
                  }
                  disabled={selectedConv.mode !== 'HUMAN_TAKEOVER'}
                  className="flex-1 bg-[#1e2a32] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendStaffReply}
                  disabled={!replyText.trim() || actionLoading || selectedConv.mode !== 'HUMAN_TAKEOVER'}
                  className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a conversation to monitor
            </div>
          )}
        </div>

        {/* Right: Interactive WhatsApp Mobile Simulator (4 cols) */}
        <div className="lg:col-span-4 glass-card rounded-2xl border border-slate-800 flex flex-col p-4 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-xs text-white">Interactive WhatsApp Phone Simulator</h3>
              <p className="text-[10px] text-slate-400">Simulate incoming patient messages in real time.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Simulated Patient Name</label>
              <input
                type="text"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Patient WhatsApp Number</label>
              <input
                type="text"
                value={simPhone}
                onChange={(e) => setSimPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Message Content</label>
              <textarea
                value={simMessage}
                onChange={(e) => setSimMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Can you book Dr. Priya for tomorrow 11 AM for HydraFacial?"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => handleSendSimulatorMessage()}
              disabled={simSending || !simMessage.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{simSending ? 'Processing via LangChain AI...' : 'Dispatch Message as Patient'}</span>
            </button>
          </div>

          {/* Quick Click Prompts */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Quick Test Prompts
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                'What is the price of HydraFacial?',
                'Book Dr. Priya for tomorrow 11:00 AM',
                'Can I take isotretinoin for my acne marks?',
                'I want to speak with your receptionist please',
                'Do you have valet parking available?',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendSimulatorMessage(prompt)}
                  className="text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  💬 {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
