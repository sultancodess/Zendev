import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Search, Bell, ChevronRight, X, Sparkles,
  AlertCircle, Calendar, MessageSquare, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const CRUMBS = {
  overview:      { title: 'Overview', desc: 'Real-time patient pipeline & throughput' },
  conversations: { title: 'Chat Inbox', desc: 'Live WhatsApp conversations & handoff queue' },
  leads:         { title: 'Leads Pipeline', desc: 'Auto-qualified patient inquiries' },
  appointments:  { title: 'Appointments', desc: 'Confirmed clinic calendar & schedule' },
  services:      { title: 'Treatments', desc: 'Medical services, pricing & protocols' },
  doctors:       { title: 'Doctors', desc: 'Specialist availability & slot limits' },
  faqs:          { title: 'Knowledge Base', desc: 'Google Docs synced clinical FAQs' },
  analytics:     { title: 'Analytics', desc: 'Conversion metrics & channel attribution' },
  simulator:     { title: 'Live Simulator', desc: 'Interactive WhatsApp testing sandbox' },
  settings:      { title: 'Settings', desc: 'WhatsApp API keys, clinic rules & hours' },
};

export function Header({ onMenuClick, activeTab, onNavigate, pendingHandoffCount = 0 }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const notifRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowNotifications(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentCrumb = CRUMBS[activeTab] || { title: activeTab, desc: '' };

  const notifications = [
    ...(pendingHandoffCount > 0 ? [{
      id: 'handoff-alert',
      type: 'urgent',
      title: `${pendingHandoffCount} Handoffs waiting for staff`,
      time: 'Just now',
      action: 'conversations',
      icon: AlertCircle,
      color: '#ef4444',
      bg: '#fee2e2',
    }] : []),
    {
      id: 'booking-1',
      type: 'success',
      title: 'Appointment booked: Sunita K. (HydraFacial)',
      time: '12m ago',
      action: 'appointments',
      icon: Calendar,
      color: '#16a34a',
      bg: '#dcfce7',
    },
    {
      id: 'ai-lead',
      type: 'info',
      title: 'New lead qualified: Laser Hair Removal (Acne history)',
      time: '24m ago',
      action: 'leads',
      icon: Sparkles,
      color: '#2563eb',
      bg: '#eff6ff',
    },
    {
      id: 'sync-ok',
      type: 'info',
      title: 'Google Docs knowledge base auto-synced',
      time: '1h ago',
      action: 'faqs',
      icon: CheckCircle2,
      color: '#16a34a',
      bg: '#dcfce7',
    }
  ];

  const quickNav = [
    { id: 'overview', label: 'Overview', desc: 'Metrics, live status & throughput' },
    { id: 'conversations', label: 'Chat Inbox', desc: 'Pending handoffs and WhatsApp chat' },
    { id: 'leads', label: 'Leads', desc: 'Kanban board of qualified leads' },
    { id: 'appointments', label: 'Appointments', desc: 'Doctor schedule & patient slots' },
    { id: 'services', label: 'Treatments', desc: 'Service catalog & pricing' },
    { id: 'simulator', label: 'Simulator', desc: 'Test WhatsApp AI agent responses' },
    { id: 'settings', label: 'Settings', desc: 'Clinic profile & Google Docs sync' },
  ].filter(item => item.label.toLowerCase().includes(commandSearch.toLowerCase()) || item.desc.toLowerCase().includes(commandSearch.toLowerCase()));

  return (
    <>
      <header className="topbar px-5 gap-4 sticky top-0 z-30 bg-white border-b border-gray-200">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="btn btn-ghost btn-sm lg:hidden p-1.5 rounded-lg text-gray-600 hover:text-gray-900"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb with context */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">Derma.ai</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:inline" />
          <span className="text-sm text-gray-900 font-bold truncate">
            {currentCrumb.title}
          </span>
          <span className="text-xs text-gray-400 hidden md:inline ml-1 font-normal border-l border-gray-200 pl-2">
            {currentCrumb.desc}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Global Search Bar / Command Palette Trigger */}
        <button
          onClick={() => setShowCommandPalette(true)}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50/80 hover:bg-gray-100/80 hover:border-gray-300 transition-all text-left text-gray-400 text-xs w-64 group"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          <span className="flex-1 truncate">Search commands, pages, leads…</span>
          <kbd className="text-[10px] font-mono text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Urgent Handoff Pill (if pending) */}
        {pendingHandoffCount > 0 && (
          <button
            onClick={() => onNavigate('conversations')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors animate-pulse"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>{pendingHandoffCount} Handoff{pendingHandoffCount > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingHandoffCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Activity & Alerts</span>
                  {pendingHandoffCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700">
                      {pendingHandoffCount} Action required
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigate(n.action);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-gray-50 flex items-start gap-3 cursor-pointer transition-colors"
                    >
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: n.bg, color: n.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 leading-tight truncate">
                          {n.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 self-center" />
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="text-[11px] text-gray-500">Autonomous WhatsApp Agent v2.4</span>
                <button
                  onClick={() => { onNavigate('conversations'); setShowNotifications(false); }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View Inbox →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* User Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {(user?.name?.charAt(0) || 'D').toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {user?.name || 'Staff User'}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              {user?.role || 'Reception Desk'}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Command Palette Modal */}
      {showCommandPalette && (
        <div className="modal-backdrop" onClick={() => setShowCommandPalette(false)}>
          <div
            className="modal max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50/50">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                placeholder="Jump to page or tool..."
                value={commandSearch}
                onChange={e => setCommandSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              <kbd className="text-[10px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                ESC
              </kbd>
            </div>

            {/* Suggestions */}
            <div className="p-2 max-h-72 overflow-y-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                Navigation
              </p>
              {quickNav.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowCommandPalette(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-emerald-700">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                </button>
              ))}
              {quickNav.length === 0 && (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No matching sections found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
