import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeBadge } from './ThemeBadge.jsx';

export function Header({ onMenuClick, pendingHandoffCount = 0 }) {
  const { user, clinic } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 h-14 px-4 sm:px-6 flex items-center justify-between"
      style={{
        background: 'rgba(3,5,8,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Menu className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">
              {clinic?.name || 'DermaCare Skin & Laser Clinic'}
            </h2>
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest"
              style={{
                background: 'rgba(34,197,94,0.1)',
                color: '#86efac',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              AI Active
            </span>
          </div>
          <p className="text-[10px] text-slate-600 hidden sm:block mt-0.5 font-medium">
            Derma.ai · WhatsApp Cloud API v19.0
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Theme / Status Badge */}
        <ThemeBadge />

        {/* Handoff alert */}
        {pendingHandoffCount > 0 && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold animate-pulse"
            style={{
              background: 'rgba(244,63,94,0.12)',
              border: '1px solid rgba(244,63,94,0.3)',
              color: '#fda4af',
            }}
          >
            <Bell className="w-3 h-3" />
            <span>{pendingHandoffCount} Handoff</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-5 w-px bg-white/8 hidden sm:block" />

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-black shrink-0"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
              boxShadow: '0 0 12px rgba(34,197,94,0.3)',
            }}
          >
            {(user?.name?.charAt(0) || 'D').toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-[11px] font-bold text-slate-200 leading-tight">{user?.name || 'Staff User'}</p>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold">{user?.role || 'RECEPTIONIST'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
