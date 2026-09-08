import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, CalendarCheck, UserX, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { api } from '../services/api.js';

const KPI_CARDS = (rates) => [
  { label: 'Qualification Rate', value: rates.qualificationRate || '0.0%', sub: 'Qualified Leads / Inquiries', color: '#14b8a6', glow: 'rgba(20,184,166,0.2)' },
  { label: 'Booking Rate',       value: rates.bookingRate || '0.0%',       sub: 'Booked / Total Leads',        color: '#22c55e', glow: 'rgba(34,197,94,0.2)' },
  { label: 'Completion Rate',    value: rates.completionRate || '0.0%',    sub: 'Completed / Total Booked',    color: '#4ade80', glow: 'rgba(74,222,128,0.2)' },
  { label: 'No-Show Rate',       value: rates.noShowRate || '0.0%',        sub: 'No-Shows / Total Booked',     color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
];

export function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const rates           = data?.rates           || {};
  const sourceBreakdown = data?.sourceBreakdown  || [];
  const serviceBreakdown= data?.serviceBreakdown || [];

  const kpiCards = KPI_CARDS(rates);
  const srcMax   = Math.max(...sourceBreakdown.map(i => i.count), 1);
  const svcMax   = Math.max(...serviceBreakdown.map(i => i.count), 1);

  return (
    <div className="space-y-6 page-enter">

      {/* ── Header ── */}
      <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="font-bold text-base text-white">Analytics & Performance Metrics</h2>
          <p className="text-xs text-slate-500 mt-0.5">PRD standard conversion rates and live attribution tracking</p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map(card => (
          <div
            key={card.label}
            className="stat-card glass-card rounded-2xl p-5 relative overflow-hidden"
          >
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-40"
              style={{ background: card.glow }}
            />
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">{card.label}</p>
            <div
              className="text-3xl font-black tracking-tight leading-none"
              style={{ color: card.color, textShadow: `0 0 20px ${card.glow}` }}
            >
              {card.value}
            </div>
            <p className="text-[10px] text-slate-600 mt-2">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Breakdown Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Source Attribution */}
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Lead Source Attribution
          </h4>
          <p className="text-[10px] text-slate-500 mb-5">Where your patients find you</p>
          <div className="space-y-4">
            {sourceBreakdown.map((item, i) => {
              const pct = Math.round((item.count / srcMax) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">{item.name}</span>
                    <span className="font-extrabold text-emerald-400 mono">{item.count} leads</span>
                  </div>
                  <div className="h-2 rounded-full bg-dark-800 overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #059669, #22c55e, #4ade80)',
                        boxShadow: '0 0 10px rgba(34,197,94,0.4)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Popularity */}
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Treatment Demand Distribution
          </h4>
          <p className="text-[10px] text-slate-500 mb-5">Most enquired services</p>
          <div className="space-y-4">
            {serviceBreakdown.map((item, i) => {
              const pct = Math.round((item.count / svcMax) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300 truncate pr-3">{item.name}</span>
                    <span className="font-extrabold text-teal-400 mono shrink-0">{item.count} enquiries</span>
                  </div>
                  <div className="h-2 rounded-full bg-dark-800 overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #0d9488, #14b8a6)',
                        boxShadow: '0 0 10px rgba(20,184,166,0.4)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
