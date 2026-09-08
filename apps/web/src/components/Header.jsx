import React from 'react';
import { Menu, Bell, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const PAGE_LABELS = {
  overview:      'overview',
  conversations: 'chat-inbox',
  leads:         'leads',
  appointments:  'appointments',
  services:      'treatments',
  doctors:       'doctors',
  faqs:          'faqs',
  analytics:     'analytics',
  simulator:     'simulator',
  settings:      'settings',
};

export function Header({ onMenuClick, activeTab, onNavigate, pendingHandoffCount = 0 }) {
  const { user } = useAuth();
  const crumb = PAGE_LABELS[activeTab] || activeTab;

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-12 bg-white"
      style={{ borderBottom: '1px solid #e5e7eb' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onMenuClick}
          className="lg:hidden mr-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <Menu style={{ width: 16, height: 16 }} />
        </button>

        <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>dashboard</span>
        <ChevronRight style={{ width: 12, height: 12, color: '#d1d5db' }} />
        <span style={{ fontSize: 13, color: '#111111', fontWeight: 600 }}>{crumb}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        {/* Handoff alert */}
        {pendingHandoffCount > 0 && (
          <button
            onClick={() => onNavigate?.('conversations')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            style={{ fontSize: 12, fontWeight: 600, border: '1px solid #fecaca' }}
          >
            <Bell style={{ width: 13, height: 13 }} />
            {pendingHandoffCount} handoff{pendingHandoffCount > 1 ? 's' : ''} pending
          </button>
        )}

        {/* CTA */}
        <button
          onClick={() => onNavigate?.('simulator')}
          className="btn-primary"
          style={{ fontSize: 12, padding: '6px 14px' }}
        >
          <Play style={{ width: 11, height: 11 }} />
          Launch Simulator
        </button>

        {/* User pill */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ border: '1px solid #e5e7eb' }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white shrink-0"
            style={{ background: '#22c55e', fontSize: 10 }}
          >
            {(user?.name?.charAt(0) || 'D').toUpperCase()}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
            {user?.name || 'Staff'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
