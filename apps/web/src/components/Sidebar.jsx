import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  Sparkles,
  UserCheck,
  HelpCircle,
  BarChart3,
  Smartphone,
  Settings,
  X,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Logo } from './Logo.jsx';

const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',           icon: LayoutDashboard },
  { id: 'conversations', label: 'Live Chat Inbox',     icon: MessageSquare,  badge: 'Live' },
  { id: 'leads',         label: 'Leads Pipeline',      icon: Users },
  { id: 'appointments',  label: 'Appointments',        icon: Calendar },
  { id: 'services',      label: 'Treatments',          icon: Sparkles },
  { id: 'doctors',       label: 'Doctors',             icon: UserCheck },
  { id: 'faqs',          label: 'FAQs',                icon: HelpCircle },
  { id: 'analytics',     label: 'Analytics',           icon: BarChart3 },
  { id: 'simulator',     label: 'WhatsApp Simulator',  icon: Smartphone },
  { id: 'settings',      label: 'Settings',            icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #020407 0%, #03060a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Top green hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Brand */}
        <div
          className="px-4 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Logo size={34} />
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-1.5">
          <span className="text-[9px] font-extrabold tracking-[0.18em] text-slate-700 uppercase">
            Menu
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'nav-active text-emerald-300'
                    : 'text-slate-500 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all shrink-0 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{
                      background: 'rgba(34,197,94,0.12)',
                      color: '#86efac',
                      border: '1px solid rgba(34,197,94,0.25)',
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <ChevronRight className="w-3 h-3 text-emerald-500/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Footer */}
        <div
          className="m-3 p-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-300 leading-tight">WhatsApp Webhook</p>
              <p className="text-[9px] text-emerald-400 font-mono mt-0.5 truncate">+91 98765 43210</p>
            </div>
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
