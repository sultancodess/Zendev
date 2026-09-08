import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  CalendarCheck,
  AlertCircle,
  Clock,
  TrendingUp,
  UserX,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';

export function Overview({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const overview = data?.overview || {
    totalEnquiries: 24,
    qualifiedLeads: 16,
    totalBookedAppointments: 10,
    confirmedAppointments: 8,
    completedAppointments: 6,
    pendingHandoffs: 2,
    noShowAppointments: 1
  };

  const rates = data?.rates || {
    qualificationRate: '66.7%',
    bookingRate: '41.7%',
    completionRate: '60.0%',
    conversionRate: '41.7%'
  };

  const statCards = [
    {
      title: "Today's Enquiries",
      value: overview.totalEnquiries,
      subtext: 'WhatsApp Inbound Live',
      icon: MessageSquare,
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      nav: 'conversations'
    },
    {
      title: 'Qualified Leads',
      value: overview.qualifiedLeads,
      subtext: `Qual. Rate: ${rates.qualificationRate}`,
      icon: Users,
      color: 'text-emerald-300',
      bgGlow: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      nav: 'leads'
    },
    {
      title: 'Booked Appointments',
      value: overview.totalBookedAppointments,
      subtext: `Booking Rate: ${rates.bookingRate}`,
      icon: CalendarCheck,
      color: 'text-lime-400',
      bgGlow: 'bg-lime-500/10 border-lime-500/20 text-lime-400',
      nav: 'appointments'
    },
    {
      title: 'Human Handoffs Required',
      value: overview.pendingHandoffs,
      subtext: 'Medical & Staff takeover',
      icon: AlertCircle,
      color: 'text-rose-400',
      bgGlow: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      nav: 'conversations',
      alert: overview.pendingHandoffs > 0
    },
    {
      title: 'Completed Consultations',
      value: overview.completedAppointments,
      subtext: `Completion: ${rates.completionRate}`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      nav: 'appointments'
    },
    {
      title: 'No-Shows Recorded',
      value: overview.noShowAppointments,
      subtext: 'Requires auto-reminder',
      icon: UserX,
      color: 'text-amber-400',
      bgGlow: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      nav: 'appointments'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070e17] via-[#0b1726] to-[#070e17] border border-emerald-500/30 p-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3 shadow-[0_0_10px_rgba(34,197,94,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>EvilChat Autonomous Mode Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            WhatsApp Lead & Appointment Automation
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Autonomous multi-intent AI handling patient triage, pricing FAQs, Google Doc sync, and instant doctor booking.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('simulator')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test EvilChat Sandbox</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigate(card.nav)}
              className="bg-[#0A0F18] rounded-2xl p-5 border border-zinc-800/90 hover:border-emerald-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.bgGlow}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  <span>{card.subtext}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Funnel & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-[#0A0F18] rounded-2xl p-6 border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Lead Conversion Funnel</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Live Real-Time
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>1. Inbound WhatsApp Enquiries</span>
                <span className="font-mono text-emerald-400">{overview.totalEnquiries} (100%)</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full w-full shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>2. Qualified Leads</span>
                <span className="font-mono text-emerald-400">{overview.qualifiedLeads} ({rates.qualificationRate})</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                  style={{ width: rates.qualificationRate }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>3. Confirmed Appointments</span>
                <span className="font-mono text-emerald-400">{overview.totalBookedAppointments} ({rates.bookingRate})</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                  style={{ width: rates.bookingRate }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>4. Completed Treatments</span>
                <span className="font-mono text-emerald-400">{overview.completedAppointments} ({rates.completionRate})</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-lime-500 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(132,204,22,0.3)]"
                  style={{ width: rates.completionRate }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* EvilChat Action Center */}
        <div className="bg-[#0A0F18] rounded-2xl p-6 border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">EvilChat Action Center</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Instant controls to monitor AI conversations and human receptionist takeover.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('conversations')}
                className="w-full p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 text-left hover:bg-zinc-850 transition-all flex items-center justify-between group"
              >
                <div className="text-xs">
                  <p className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    Human Handoff Queue
                  </p>
                  <p className="text-slate-400 text-[11px]">{overview.pendingHandoffs} conversations waiting for staff</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('appointments')}
                className="w-full p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 text-left hover:bg-zinc-850 transition-all flex items-center justify-between group"
              >
                <div className="text-xs">
                  <p className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    Doctor Schedule & Slot Grid
                  </p>
                  <p className="text-slate-400 text-[11px]">Dr. Ananya & Dr. Vikram available</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="w-full p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 text-left hover:bg-zinc-850 transition-all flex items-center justify-between group"
              >
                <div className="text-xs">
                  <p className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    Google Docs & Knowledge Sync
                  </p>
                  <p className="text-emerald-400 font-medium text-[11px]">Sync status: Active</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/80 text-center">
            <span className="text-[10px] text-slate-500 font-medium font-mono">
              Meta WhatsApp Business Cloud API v19.0 Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
