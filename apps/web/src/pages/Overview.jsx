import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  CalendarCheck,
  AlertCircle,
  TrendingUp,
  UserX,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { api } from '../services/api.js';

const STAT_CARDS = (overview, rates) => [
  {
    title:   "Today's Enquiries",
    value:   overview.totalEnquiries,
    sub:     'WhatsApp Inbound',
    icon:    MessageSquare,
    accent:  '#22c55e',
    glow:    'rgba(34,197,94,0.25)',
    nav:     'conversations',
    trend:   '+12%',
  },
  {
    title:   'Qualified Leads',
    value:   overview.qualifiedLeads,
    sub:     `Rate: ${rates.qualificationRate}`,
    icon:    Users,
    accent:  '#14b8a6',
    glow:    'rgba(20,184,166,0.25)',
    nav:     'leads',
    trend:   '+8%',
  },
  {
    title:   'Booked Appointments',
    value:   overview.totalBookedAppointments,
    sub:     `Booking: ${rates.bookingRate}`,
    icon:    CalendarCheck,
    accent:  '#a78bfa',
    glow:    'rgba(167,139,250,0.25)',
    nav:     'appointments',
    trend:   '+5%',
  },
  {
    title:   'Human Handoffs',
    value:   overview.pendingHandoffs,
    sub:     'Awaiting staff',
    icon:    AlertCircle,
    accent:  '#f43f5e',
    glow:    'rgba(244,63,94,0.25)',
    nav:     'conversations',
    alert:   overview.pendingHandoffs > 0,
  },
  {
    title:   'Completed Consults',
    value:   overview.completedAppointments,
    sub:     `Completion: ${rates.completionRate}`,
    icon:    TrendingUp,
    accent:  '#22c55e',
    glow:    'rgba(34,197,94,0.2)',
    nav:     'appointments',
    trend:   '+18%',
  },
  {
    title:   'No-Shows',
    value:   overview.noShowAppointments,
    sub:     'Needs auto-reminder',
    icon:    UserX,
    accent:  '#f59e0b',
    glow:    'rgba(245,158,11,0.25)',
    nav:     'appointments',
  },
];

const FUNNEL_STEPS = (overview, rates) => [
  { label: 'Inbound WhatsApp Enquiries', value: overview.totalEnquiries,           pct: '100%',                    color: '#22c55e' },
  { label: 'Qualified Leads',            value: overview.qualifiedLeads,            pct: rates.qualificationRate,   color: '#14b8a6' },
  { label: 'Confirmed Appointments',     value: overview.totalBookedAppointments,   pct: rates.bookingRate,         color: '#a78bfa' },
  { label: 'Completed Treatments',       value: overview.completedAppointments,     pct: rates.completionRate,      color: '#4ade80' },
];

export function Overview({ onNavigate }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const overview = data?.overview || {
    totalEnquiries: 24, qualifiedLeads: 16, totalBookedAppointments: 10,
    confirmedAppointments: 8, completedAppointments: 6, pendingHandoffs: 2, noShowAppointments: 1
  };
  const rates = data?.rates || {
    qualificationRate: '66.7%', bookingRate: '41.7%', completionRate: '60.0%', conversionRate: '41.7%'
  };

  const cards  = STAT_CARDS(overview, rates);
  const funnel = FUNNEL_STEPS(overview, rates);

  return (
    <div className="space-y-6 page-enter">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06]"
        style={{
          background: 'linear-gradient(135deg, #060e18 0%, #0b1a2c 40%, #071018 100%)',
          boxShadow: '0 0 60px rgba(34,197,94,0.08), 0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* BG accent orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/6 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="relative z-10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest mb-4"
              style={{ boxShadow: '0 0 12px rgba(34,197,94,0.15)' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              EvilChat · Autonomous Mode Active
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              WhatsApp Lead &{' '}
              <span className="text-emerald-400" style={{ textShadow: '0 0 30px rgba(34,197,94,0.4)' }}>
                Appointment
              </span>{' '}
              Automation
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
              Multi-intent AI handling patient triage, pricing FAQs, Google Doc sync, and real-time doctor booking.
            </p>

            {/* Quick stats row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {[
                { label: 'Enquiries Today', value: overview.totalEnquiries },
                { label: 'Booking Rate',    value: rates.bookingRate },
                { label: 'AI Uptime',       value: '99.9%' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{s.value}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('simulator')}
              className="btn-glow px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Test AI Sandbox
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigate(card.nav)}
              className="stat-card glass-card glass-card-hover text-left p-4 sm:p-5 rounded-2xl group relative overflow-hidden"
            >
              {/* Accent corner glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ background: card.glow }}
              />

              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${card.accent}20, ${card.accent}10)`,
                    border: `1px solid ${card.accent}30`,
                    boxShadow: `0 0 12px ${card.glow}`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.accent }} />
                </div>
                {card.trend && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {card.trend}
                  </span>
                )}
                {card.alert && card.value > 0 && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md text-rose-400 bg-rose-500/10 border border-rose-500/20 animate-pulse">
                    URGENT
                  </span>
                )}
              </div>

              {/* Value */}
              <div className="metric-value text-3xl font-black tracking-tight leading-none mb-1">
                {card.value}
              </div>

              {/* Label & sub */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">{card.title}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-slate-500">{card.sub}</span>
                <ArrowUpRight
                  className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  style={{ color: card.accent + '80' }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Funnel + Action Center ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Conversion Funnel */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Lead Conversion Funnel</h3>
                <p className="text-[10px] text-slate-500">Real-time pipeline view</p>
              </div>
            </div>
            <span className="badge-green text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live
            </span>
          </div>

          <div className="space-y-5">
            {funnel.map((step, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center text-black"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">{step.label}</span>
                  </div>
                  <span
                    className="text-xs font-extrabold mono"
                    style={{ color: step.color }}
                  >
                    {step.value} <span className="text-slate-500 font-medium">({step.pct})</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-dark-800 overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: step.pct,
                      background: `linear-gradient(90deg, ${step.color}cc, ${step.color})`,
                      boxShadow: `0 0 10px ${step.color}55`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="glass-card rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Action Center</h3>
              <p className="text-[10px] text-slate-500">Quick controls</p>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {[
              { label: 'Human Handoff Queue',         sub: `${overview.pendingHandoffs} conversations waiting`, nav: 'conversations', dot: overview.pendingHandoffs > 0 ? 'rose' : 'emerald' },
              { label: "Doctor Schedule & Slots",     sub: 'Dr. Ananya & Dr. Vikram on call', nav: 'appointments', dot: 'emerald' },
              { label: 'Google Docs Knowledge Sync',  sub: 'Sync Status: Active',              nav: 'settings',      dot: 'emerald' },
            ].map(item => (
              <button
                key={item.nav}
                onClick={() => onNavigate(item.nav)}
                className="w-full group p-3.5 rounded-xl bg-dark-850/80 border border-white/5 hover:border-emerald-500/30 hover:bg-dark-800/80 text-left transition-all flex items-center gap-3"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.dot === 'rose' ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.sub}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <span className="text-[10px] text-slate-600 mono">Meta WhatsApp Cloud API v19.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
