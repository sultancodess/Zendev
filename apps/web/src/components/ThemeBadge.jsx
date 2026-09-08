import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Check, Moon, Zap, Activity } from 'lucide-react';

export function ThemeBadge({ variant = 'header' }) {
  const [showDetails, setShowDetails] = useState(false);

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold shadow-[0_0_12px_rgba(34,197,94,0.15)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Derma Dark</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-slate-200 border border-emerald-500/30 hover:border-emerald-400/60 text-xs font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)] transition-all duration-200"
        title="Theme & Engine Status"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold tracking-tight">Derma</span>
          <span className="text-emerald-400 font-extrabold text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30">
            OBSIDIAN
          </span>
        </div>

        <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Theme & Engine Details Dropdown Popover */}
      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-[#0a0f18] border border-emerald-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Derma Engine v2.4</h4>
                  <p className="text-[10px] text-emerald-400">Green & Obsidian Theme</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                ACTIVE
              </span>
            </div>

            <div className="py-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Color Profile</span>
                <span className="text-slate-200 font-medium flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-black border border-zinc-700 inline-block" />
                  Neon Green / Obsidian
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>WhatsApp Webhook</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>AI Grounding Safety</span>
                <span className="text-emerald-400 font-semibold">Strict (0 Hallucination)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>DPDP Compliance</span>
                <span className="text-slate-200 font-mono">100% Audit Logged</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Dark Theme Standard</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Enabled
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ThemeBadge;

