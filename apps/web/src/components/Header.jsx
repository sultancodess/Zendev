import React, { useState } from 'react';
import { Menu, Search, Bell, Play, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const CRUMBS = {
  overview:      'Overview',
  conversations: 'Chat Inbox',
  leads:         'Leads',
  appointments:  'Appointments',
  services:      'Treatments',
  doctors:       'Doctors',
  faqs:          'FAQs',
  analytics:     'Analytics',
  simulator:     'Live Simulator',
  settings:      'Settings',
};

export function Header({ onMenuClick, activeTab, onNavigate, pendingHandoffCount = 0 }) {
  const { user } = useAuth();
  const [searching, setSearching] = useState(false);

  return (
    <header className="topbar px-5 gap-4">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="btn btn-ghost btn-sm lg:hidden"
        style={{ padding: '6px', borderRadius: 8 }}
      >
        <Menu style={{ width: 16, height: 16 }} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: 'var(--c-text-3)', fontWeight: 500 }}>dashboard</span>
        <ChevronRight style={{ width: 12, height: 12, color: 'var(--c-border)' }} />
        <span style={{ fontSize: 13, color: 'var(--c-text-1)', fontWeight: 700 }}>
          {CRUMBS[activeTab] || activeTab}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search */}
      <div className="hidden md:flex items-center relative">
        <Search
          style={{ position: 'absolute', left: 10, width: 13, height: 13, color: 'var(--c-text-3)' }}
        />
        <input
          placeholder="Search patients, leads…"
          className="input input-search"
          style={{ width: 220, fontSize: 12 }}
          onFocus={() => setSearching(true)}
          onBlur={() => setSearching(false)}
        />
        <kbd
          style={{ position: 'absolute', right: 10, fontSize: 10, color: 'var(--c-text-3)', background: 'var(--c-bg)', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--c-border)' }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Handoff alert */}
      {pendingHandoffCount > 0 && (
        <button
          onClick={() => onNavigate('conversations')}
          className="btn btn-danger btn-sm hidden sm:inline-flex"
          style={{ animation: 'pulse 2s infinite' }}
        >
          <Bell style={{ width: 13, height: 13 }} />
          {pendingHandoffCount} handoff{pendingHandoffCount > 1 ? 's' : ''}
        </button>
      )}

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'var(--c-border)', flexShrink: 0 }} className="hidden sm:block" />

      {/* User */}
      <div className="flex items-center gap-2.5">
        <div
          style={{ width: 30, height: 30, borderRadius: 8, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}
        >
          {(user?.name?.charAt(0) || 'D').toUpperCase()}
        </div>
        <div className="hidden md:block">
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-1)', lineHeight: 1.2 }}>
            {user?.name || 'Staff'}
          </p>
          <p style={{ fontSize: 10, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {user?.role || 'Receptionist'}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
