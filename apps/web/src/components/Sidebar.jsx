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
  { id: 'overview',       label: 'Overview',              icon: LayoutDashboard },
  { id: 'conversations',  label: 'Evil Chat Live',         icon: MessageSquare,  badge: 'Live' },
  { id: 'leads',          label: 'Leads Pipeline',         icon: Users },
  { id: 'appointments',   label: 'Appointments',           icon: Calendar },
  { id: 'services',       label: 'Treatments & Pricing',   icon: Sparkles },
  { id: 'doctors',        label: 'Doctors & Schedules',    icon: UserCheck },
  { id: 'faqs',           label: 'Approved FAQs',          icon: HelpCircle },
  { id: 'analytics',      label: 'Analytics & Funnels',    icon: BarChart3 },
  { id: 'simulator',      label: 'WhatsApp Simulator',     icon: Smartphone,     highlight: true },
  { id: 'settings',       label: 'Settings & Integrations',icon: Settings },
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

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #06090f 0%, #070a10 60%, #06090f 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Subtle top green glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

        {/* Brand Header */}
        <div className="px-4 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Logo size={38} />
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Section Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[9px] font-bold tracking-[0.15em] text-slate-600 uppercase">
            Navigation
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar pb-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'nav-active text-emerald-300'
                    : item.highlight
                    ? 'text-emerald-400/80 border border-emerald-500/15 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/30 hover:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : item.highlight
                      ? 'bg-emerald-950/50 text-emerald-400/70'
                      : 'bg-white/5 text-slate-500 group-hover:bg-white/8 group-hover:text-slate-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="tracking-tight font-semibold">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500 text-black tracking-wide uppercase">
                      NEW
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3 h-3 text-emerald-400/60" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Status Widget */}
        <div className="p-3 mx-3 mb-4 rounded-2xl bg-dark-900/80 border border-white/5"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600/20 to-emerald-400/20 border border-emerald-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-200 leading-tight">EvilChat Webhook</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">+91 98765 43210</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Live</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
