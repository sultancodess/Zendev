'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  Sparkles,
  Stethoscope,
  BookOpen,
  CreditCard,
  PhoneCall,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Activity,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/conversations', label: 'Conversations & Sim', icon: MessageSquare, badge: 'Live' },
  { href: '/dashboard/leads', label: 'Leads Kanban', icon: Users },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/services', label: 'Services & Pricing', icon: Sparkles },
  { href: '/dashboard/doctors', label: 'Doctors & Shifts', icon: Stethoscope },
  { href: '/dashboard/knowledge', label: 'Knowledge & FAQs', icon: BookOpen },
  { href: '/dashboard/payments', label: 'Razorpay Payments', icon: CreditCard },
  { href: '/dashboard/whatsapp', label: 'WhatsApp Gateway', icon: PhoneCall },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Clinic & Audit', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#090d16] flex text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0c121e]/90 backdrop-blur-xl flex flex-col fixed inset-y-0 z-40">
        {/* Clinic Brand */}
        <div className="p-4 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                DermaCare<span className="text-emerald-400">.ai</span>
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Assistant Active</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Clinic Status & Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-2">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">WhatsApp Webhook</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Healthy
              </span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Indiranagar, Bengaluru</div>
          </div>

          <div className="flex items-center justify-between px-1">
            <Link
              href="/"
              className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[10px] text-slate-500 font-mono">v1.0 (Phase 1)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-[#090d16]">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-[#090d16]/75 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Clinic Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold capitalize">
              {pathname.split('/')[2] || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini 2.0 Flash + RAG Vector Store</span>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                PS
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white">Dr. Priya Sharma</div>
                <div className="text-[10px] text-emerald-400">Clinic Owner / Chief Dermatologist</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
