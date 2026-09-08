import React from 'react';
import { Menu, Smartphone, Bell, ShieldCheck, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeBadge } from './ThemeBadge.jsx';

export function Header({ onMenuClick, onOpenSimulator, pendingHandoffCount = 0 }) {
  const { user, clinic } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070a10]/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">
              {clinic?.name || 'DermaCare Skin & Laser Clinic'}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            EvilChat Grounded Assistant • WhatsApp Cloud API v19.0
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Interactive Theme Badge */}
        <ThemeBadge />

        {/* Quick WhatsApp Simulator Launcher */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 hover:border-emerald-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(34,197,94,0.15)]"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          <span className="hidden sm:inline">Launch Simulator</span>
          <span className="sm:hidden">Simulator</span>
        </button>

        {/* Handoff Alert Pill */}
        {pendingHandoffCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{pendingHandoffCount} Handoff Req</span>
          </div>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black flex items-center justify-center font-extrabold text-xs shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            {user?.name?.charAt(0) || 'E'}
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-bold text-slate-200 leading-tight">{user?.name || 'Staff User'}</p>
            <p className="text-slate-500 font-medium text-[10px] uppercase tracking-wider">{user?.role || 'RECEPTIONIST'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
