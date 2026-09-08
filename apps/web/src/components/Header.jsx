import React from 'react';
import { Menu, Smartphone, Bell, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeBadge } from './ThemeBadge.jsx';

export function Header({ onMenuClick, onOpenSimulator, pendingHandoffCount = 0 }) {
  const { user, clinic } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between"
      style={{
        background: 'rgba(6,9,15,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 1px 0 rgba(34,197,94,0.05)',
      }}
    >
      {/* Left: menu button + clinic name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">
              {clinic?.name || 'DermaCare Skin & Laser Clinic'}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              AI Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5 font-medium tracking-wide">
            EvilChat • WhatsApp Cloud API v19.0
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Badge */}
        <ThemeBadge />

        {/* WhatsApp Simulator CTA */}
        <button
          onClick={onOpenSimulator}
          className="btn-glow flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-[11px] font-extrabold transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Launch Simulator</span>
          <span className="sm:hidden">Sim</span>
        </button>

        {/* Handoff Alert */}
        {pendingHandoffCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-300 text-[10px] font-extrabold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
            <span>{pendingHandoffCount} Handoff</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-white/8 hidden sm:block" />

        {/* User Avatar */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-black"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
              boxShadow: '0 0 12px rgba(34,197,94,0.35)',
            }}
          >
            {user?.name?.charAt(0) || 'E'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[11px] font-bold text-slate-200 leading-tight">{user?.name || 'Staff User'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role || 'RECEPTIONIST'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
