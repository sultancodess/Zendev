import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api.js';

const QUICK_TEST_PROMPTS = [
  { label: '👋 Greeting', text: 'Hi, good morning' },
  { label: '💰 Acne Treatment Fee', text: 'Acne treatment fee kitni hai?' },
  { label: '💆 PRP Hair Loss Cost', text: 'What is the cost of PRP hair therapy?' },
  { label: '📅 Book Appointment', text: 'I want to book an appointment with dermatologist today' },
  { label: '⏰ Select Slot (2:30 PM)', text: '2:30 PM' },
  { label: '🏥 Timings & Location', text: 'Clinic address kahan hai?' },
  { label: '🚨 Medical Question (Safe)', text: 'Mere acne ke liye kaunsi medicine lu?' },
  { label: '👨‍⚕️ Speak to Doctor', text: 'Mujhe doctor se baat karni hai' },
  { label: '⚠️ Emergency Signal', text: 'Emergency! severe allergic reaction and throat swelling' }
];

export function WhatsAppSimulator() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+919876543299');
  const [userName, setUserName] = useState('Rahul Test');
  const [loading, setLoading] = useState(false);
  const [lastEngineResult, setLastEngineResult] = useState(null);
  const chatBottomRef = useRef(null);

  const loadConversation = async () => {
    try {
      const data = await api.getSimulation(phoneNumber);
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        // Initial welcome bot greeting
        setMessages([
          {
            sender: 'AI',
            text: 'Namaste! Welcome to EvilChat DermaCare WhatsApp Assistant.\n\nHow can I help you today? You can ask about consultation fees, treatments, or book an appointment.',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Error loading simulation', err);
    }
  };

  useEffect(() => {
    loadConversation();
  }, [phoneNumber]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    // Optimistic customer message
    const userMsg = {
      sender: 'CUSTOMER',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.simulateMessage({
        phone: phoneNumber,
        name: userName,
        text: text.trim()
      });

      setLastEngineResult(res.engine_result);

      if (res.messages && res.messages.length > 0) {
        setMessages(res.messages);
      } else if (res.engine_result?.response_text) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: res.engine_result.response_text,
            buttons: res.engine_result.buttons,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      alert('Simulation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetSimulation(phoneNumber);
      setLastEngineResult(null);
      setMessages([
        {
          sender: 'AI',
          text: 'Namaste! Welcome to EvilChat DermaCare WhatsApp Assistant.\n\nHow can I help you today?',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0F18] p-5 rounded-2xl border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">EvilChat Interactive Sandbox & Simulator</h3>
            <p className="text-xs text-slate-400">
              Live test bench for WhatsApp Cloud API webhooks, intent engine, and appointment booking
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reset Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Test Prompt Toolbar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0A0F18] p-5 rounded-2xl border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>One-Click Test Scenarios</span>
            </h4>
            <p className="text-xs text-slate-400">
              Trigger customer intents to inspect EvilChat AI safety guardrails:
            </p>

            <div className="space-y-2">
              {QUICK_TEST_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900/90 hover:bg-emerald-950/40 border border-zinc-800 hover:border-emerald-500/40 text-xs font-medium text-slate-200 hover:text-emerald-300 transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt.label}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 font-bold shrink-0">Send →</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Decision Inspector */}
          {lastEngineResult && (
            <div className="bg-[#0A0F18] p-4 rounded-2xl border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-2">
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Engine Decision Inspector</span>
              </h5>
              <div className="bg-black/80 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono space-y-1.5 border border-zinc-800">
                <p><span className="text-emerald-400 font-bold">Intent:</span> {lastEngineResult.intent}</p>
                <p><span className="text-teal-400 font-bold">Stage:</span> {lastEngineResult.stage}</p>
                {lastEngineResult.handoff_id && (
                  <p><span className="text-rose-400 font-bold">Handoff ID:</span> {lastEngineResult.handoff_id}</p>
                )}
                {lastEngineResult.appointment && (
                  <p><span className="text-lime-400 font-bold">Booked ID:</span> {lastEngineResult.appointment.id}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Device Frame */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-full max-w-md bg-zinc-950 rounded-[2.5rem] p-3 shadow-[0_0_50px_rgba(0,0,0,0.9)] border-4 border-zinc-800">
            {/* Phone Screen */}
            <div className="bg-[#0b1118] rounded-[2rem] overflow-hidden flex flex-col h-[580px] shadow-inner border border-zinc-800">
              {/* WhatsApp Dark Header */}
              <div className="bg-[#1f2c34] text-white px-4 py-3 flex items-center justify-between border-b border-zinc-700/60 shadow-md">
                <div className="flex items-center gap-2.5">
                  <ArrowLeft className="w-4 h-4 cursor-pointer text-slate-300" />
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black flex items-center justify-center font-extrabold text-xs shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                    EC
                  </div>
                  <div>
                    <h5 className="font-bold text-xs tracking-wide text-white">EvilChat DermaCare</h5>
                    <p className="text-[10px] text-emerald-400 font-medium">Official WhatsApp AI Agent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-3.5 h-3.5" />
                  <Video className="w-3.5 h-3.5" />
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 chat-dark-bg">
                {messages.map((m, idx) => {
                  const isCustomer = m.sender === 'CUSTOMER';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs shadow-md ${
                          isCustomer
                            ? 'bg-[#005c4b] text-white rounded-tr-none border border-emerald-600/30'
                            : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-zinc-700/60'
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                        {/* Interactive Action Buttons */}
                        {m.buttons && m.buttons.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-zinc-700/60 space-y-1.5">
                            {m.buttons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                onClick={() => handleSendMessage(btn)}
                                className="w-full text-center py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] transition-colors"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400 font-mono">
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isCustomer && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-zinc-900/90 px-3 py-1.5 rounded-full w-fit border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>EvilChat AI is formulating response...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Bar */}
              <div className="p-2.5 bg-[#1f2c34] border-t border-zinc-700/60 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type WhatsApp message..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-full bg-[#2a3942] border-0 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || loading}
                  className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppSimulator;
