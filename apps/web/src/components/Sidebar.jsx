import React from 'react';
import {
  LayoutDashboard, MessageSquare, Users, Calendar,
  Sparkles, UserCheck, HelpCircle, BarChart3,
  Smartphone, Settings, AlertCircle, ChevronRight,
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

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, pendingHandoffCount = 0 }) {
  const { clinic } = useAuth();
  const navMap = Object.fromEntries(NAV.map(n => [n.id, n]));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`sidebar fixed top-0 left-0 bottom-0 z-50 flex flex-col lg:translate-x-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center justify-between">
            <Logo size={28} />
            <span className="text-[10px] text-gray-500 font-mono font-medium px-1.5 py-0.5 rounded bg-white/[0.04]">
              v2.4
            </span>
          </div>
        </div>

        {/* Clinic chip */}
        <div className="px-3 py-3 border-b border-white/[0.07]">
          <div className="text-[9px] text-gray-500 font-bold tracking-wider uppercase mb-1.5 px-1">
            Workspace
          </div>
          <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.04]">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-200 truncate">
                {clinic?.name || 'DermaCare Clinic'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                Indiranagar, Bangalore
              </p>
            </div>
            <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              LIVE
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-3 space-y-4">
          {GROUPS.map(group => (
            <div key={group.label}>
              <div className="text-[9px] text-gray-500 font-bold tracking-wider uppercase px-2.5 mb-1">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.ids.map(id => {
                  const item = navMap[id];
                  if (!item) return null;
                  const Icon = item.icon;
                  const isActive = activeTab === id;
                  const isHandoffAlert = id === 'conversations' && pendingHandoffCount > 0;

                  return (
                    <button
                      key={id}
                      onClick={() => { setActiveTab(id); setIsOpen(false); }}
                      className={`sidebar-item group ${isActive ? 'active' : ''}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-60 text-gray-400 group-hover:opacity-90'}`} />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      
                      {/* Alert or live indicator */}
                      {isHandoffAlert ? (
                        <span className="shrink-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                          {pendingHandoffCount}
                        </span>
                      ) : item.live ? (
                        <span className="live-dot shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Status footer */}
        <div className="px-3 py-3 border-t border-white/[0.07] bg-black/20">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="live-dot shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-emerald-400">WhatsApp Agent Online</p>
              <p className="text-[10px] text-gray-400 font-mono">Webhook: 200 OK • 18ms</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
