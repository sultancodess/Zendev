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
  Radio,
  Zap
} from 'lucide-react';
import { Logo } from './Logo.jsx';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'conversations', label: 'Evil Chat Live', icon: MessageSquare, badge: 'Live' },
  { id: 'leads', label: 'Leads Pipeline', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'services', label: 'Treatments & Pricing', icon: Sparkles },
  { id: 'doctors', label: 'Doctors & Schedules', icon: UserCheck },
  { id: 'faqs', label: 'Approved FAQs', icon: HelpCircle },
  { id: 'analytics', label: 'Analytics & Funnels', icon: BarChart3 },
  { id: 'simulator', label: 'WhatsApp Simulator', icon: Smartphone, highlight: true },
  { id: 'settings', label: 'Settings & Integrations', icon: Settings }
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#070a10] border-r border-zinc-800/80 text-slate-200 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Custom Logo */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-black/40">
          <Logo size={34} />
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Platform Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-600/20 to-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)] font-semibold'
                    : item.highlight
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-900/40 hover:border-emerald-500/40'
                    : 'text-slate-300 hover:bg-zinc-850/70 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive
                        ? 'text-emerald-400 scale-110'
                        : item.highlight
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {item.badge}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-black shadow-xs">
                    SANDBOX
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Clinic & Webhook Status Banner */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-black/60">
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500/30 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-xs min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-200 truncate text-[11px]">EvilChat Webhook</p>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">Live</span>
              </div>
              <p className="text-slate-400 text-[10px] truncate font-mono">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
