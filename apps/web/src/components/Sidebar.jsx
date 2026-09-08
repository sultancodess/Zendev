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
  { id: 'conversations', label: 'Chat Inbox',         icon: MessageSquare,  live: true },
  { id: 'leads',         label: 'Leads',              icon: Users },
  { id: 'appointments',  label: 'Appointments',       icon: Calendar },
  { id: 'services',      label: 'Treatments',         icon: Sparkles },
  { id: 'doctors',       label: 'Doctors',            icon: UserCheck },
  { id: 'faqs',          label: 'FAQs',               icon: HelpCircle },
  { id: 'analytics',     label: 'Analytics',          icon: BarChart3 },
  { id: 'simulator',     label: 'Live Simulator',     icon: Smartphone },
  { id: 'settings',      label: 'Settings',           icon: Settings },
];

const GROUPS = [
  { label: 'Main',       ids: ['overview','conversations','leads','appointments'] },
  { label: 'Catalog',    ids: ['services','doctors','faqs'] },
  { label: 'Reporting',  ids: ['analytics'] },
  { label: 'Tools',      ids: ['simulator','settings'] },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { clinic } = useAuth();

  const navMap = Object.fromEntries(NAV.map(n => [n.id, n]));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`sidebar fixed top-0 left-0 bottom-0 z-50 flex flex-col lg:translate-x-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo row */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <Logo size={30} />
            <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, fontFamily: 'monospace' }}>v1.0</span>
          </div>
        </div>

        {/* Clinic chip */}
        <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            Project
          </div>
          <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 12, color: '#e5e7eb', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {clinic?.name || 'DermaCare Clinic'}
            </span>
            <span className="badge-green shrink-0" style={{ fontSize: 9, background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', color: '#4ade80', padding: '1px 6px' }}>
              PRO
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-2.5 py-3 space-y-4">
          {GROUPS.map(group => (
            <div key={group.label}>
              <div style={{ fontSize: 9, color: '#4b5563', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 10px 6px' }}>
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.ids.map(id => {
                  const item = navMap[id];
                  if (!item) return null;
                  const Icon = item.icon;
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setActiveTab(id); setIsOpen(false); }}
                      className={`sidebar-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon style={{ width: 14, height: 14, flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.live && (
                        <span className="live-dot" style={{ width: 6, height: 6, flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)' }}>
            <span className="live-dot" style={{ width: 7, height: 7, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 11, color: '#e5e7eb', fontWeight: 600 }}>AI Webhook Active</p>
              <p style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace', marginTop: 1 }}>WhatsApp Cloud v19</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
