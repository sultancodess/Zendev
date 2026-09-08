import React from 'react';
import {
  LayoutDashboard, MessageSquare, Users, Calendar,
  Sparkles, UserCheck, HelpCircle, BarChart3,
  Smartphone, Settings, ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  { id: 'overview',      label: 'Overview',          icon: LayoutDashboard },
  { id: 'conversations', label: 'Chat Inbox',         icon: MessageSquare },
  { id: 'leads',         label: 'Leads',              icon: Users },
  { id: 'appointments',  label: 'Appointments',       icon: Calendar },
  { id: 'services',      label: 'Treatments',         icon: Sparkles },
  { id: 'doctors',       label: 'Doctors',            icon: UserCheck },
  { id: 'faqs',          label: 'FAQs',               icon: HelpCircle },
  { id: 'analytics',     label: 'Analytics',          icon: BarChart3 },
  { id: 'simulator',     label: 'Live Simulator',     icon: Smartphone },
  { id: 'settings',      label: 'Settings',           icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { clinic } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 192, background: '#111111' }}
      >
        {/* Logo */}
        <div className="px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <Logo size={30} />
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af', letterSpacing: '0.06em' }}
            >
              v1.0
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: 9, color: '#6b7280', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            PROJECT
          </p>
          <div className="flex items-center justify-between gap-1.5">
            <p
              className="text-white font-semibold truncate"
              style={{ fontSize: 12 }}
            >
              {clinic?.name || 'DermaCare Clinic'}
            </p>
            <span className="badge-green shrink-0" style={{ fontSize: 8 }}>PRO</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'nav-active'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}
              >
                <Icon
                  style={{ width: 15, height: 15, flexShrink: 0, opacity: isActive ? 1 : 0.7 }}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom — live status */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#22c55e' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: '#22c55e' }}
              />
            </span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>AI Webhook Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
