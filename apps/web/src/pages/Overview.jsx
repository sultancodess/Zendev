import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Users, CalendarCheck, AlertCircle,
  TrendingUp, UserX, ArrowRight, RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.js';

/* ── Tiny simple bar chart rendered with divs ── */
function MiniBarChart({ data, color = '#111111' }) {
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t"
            style={{
              height: `${Math.max(4, (d.v / max) * 88)}px`,
              background: d.highlight ? '#22c55e' : color,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.5s ease',
            }}
          />
          {d.label && (
            <span style={{ fontSize: 9, color: '#9ca3af', whiteSpace: 'nowrap' }}>{d.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Mini sparkline using SVG ── */
function Sparkline({ points, color = '#22c55e', height = 48 }) {
  const w = 200, h = height;
  const max = Math.max(...points, 1);
  const min = Math.min(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / range) * (h - 8) - 4);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CHART_DATA = [
  { v: 3,  label: '4am' },
  { v: 7,  label: '6am' },
  { v: 5,  label: '8am' },
  { v: 4,  label: '10am' },
  { v: 2,  label: '12pm' },
  { v: 1,  label: '2am' },
  { v: 2,  label: '4am' },
  { v: 1,  label: '6am' },
  { v: 8,  label: '8am', highlight: true },
  { v: 12, label: '10am', highlight: true },
  { v: 11, label: '12pm' },
  { v: 6,  label: '2pm' },
];

const SPARKLINE = [14, 18, 12, 22, 16, 20, 24, 19, 26, 22, 28, 24];

export function Overview({ onNavigate }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('24h');

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ov    = data?.overview || { totalEnquiries: 24, qualifiedLeads: 16, totalBookedAppointments: 10, completedAppointments: 6, pendingHandoffs: 2, noShowAppointments: 1 };
  const rates = data?.rates    || { qualificationRate: '66.7%', bookingRate: '41.7%', completionRate: '60.0%' };

  const STATS = [
    { label: 'WHATSAPP ENQUIRIES',   value: ov.totalEnquiries,            sub: '100% committed <1s',          icon: MessageSquare },
    { label: 'QUALIFICATION RATE',   value: rates.qualificationRate,      sub: 'Leads auto-triaged by AI',     icon: TrendingUp    },
    { label: 'BOOKED APPOINTMENTS',  value: ov.totalBookedAppointments,   sub: 'Confirmed slots this period',  icon: CalendarCheck },
    { label: 'HANDOFFS / PENDING',   value: `${ov.pendingHandoffs} / 1`,  sub: ov.pendingHandoffs > 0 ? '⚠ Waiting for staff' : 'All resolved', icon: AlertCircle, alert: ov.pendingHandoffs > 0 },
  ];

  return (
    <div className="space-y-5 page-enter">

      {/* ── Page Title ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Patient Overview
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Real-time WhatsApp AI pipeline for{' '}
            <strong style={{ color: '#111111' }}>DermaCare Skin & Laser Clinic</strong>
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); api.getAnalytics().then(setData).catch(console.error).finally(() => setLoading(false)); }}
          className="btn-ghost"
          style={{ fontSize: 12 }}
        >
          <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card p-5">
              <div className="flex items-start justify-between mb-3">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {s.label}
                </span>
                <Icon
                  style={{ width: 14, height: 14, color: s.alert ? '#ef4444' : '#d1d5db', flexShrink: 0 }}
                />
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.alert ? '#ef4444' : '#111111', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {s.value}
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Chart Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Throughput Chart (2/3) */}
        <div className="panel p-5 lg:col-span-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                WhatsApp Message Throughput
              </span>
              <span className="badge-green" style={{ fontSize: 9 }}>
                {rates.bookingRate} booking rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 mr-2">
                {[
                  { color: '#111111', label: 'Delivered' },
                  { color: '#f59e0b', label: 'Pending' },
                  { color: '#ef4444', label: 'Handoff' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{l.label}</span>
                  </div>
                ))}
              </div>
              {/* Time toggle */}
              <div
                className="flex items-center"
                style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}
              >
                {['24h', '7d'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 10px',
                      background: tab === t ? '#111111' : 'transparent',
                      color: tab === t ? '#ffffff' : '#9ca3af',
                      border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-metrics row */}
          <div className="flex items-center gap-6 mb-5 mt-2" style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 12 }}>
            {[
              { label: 'DELIVERED',   value: ov.totalEnquiries - ov.pendingHandoffs, color: '#111111' },
              { label: 'RETRIES',     value: 0,                                       color: '#f59e0b' },
              { label: 'HANDOFFS',    value: ov.pendingHandoffs,                      color: '#ef4444' },
            ].map(m => (
              <div key={m.label}>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {m.label}
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: m.color, letterSpacing: '-0.02em' }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          <MiniBarChart data={CHART_DATA} />
        </div>

        {/* Metrics Panel (1/3) */}
        <div className="panel p-5 flex flex-col">
          <div className="mb-4">
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111111', marginBottom: 2 }}>
              Conversion Funnel
            </p>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>
              AI-driven qualification to booking
            </p>
          </div>

          {/* Latency-style metrics */}
          <div
            className="grid grid-cols-3 gap-2 mb-5 pb-5"
            style={{ borderBottom: '1px solid #f3f4f6' }}
          >
            {[
              { label: 'QUALIFY', value: rates.qualificationRate },
              { label: 'BOOK',    value: rates.bookingRate },
              { label: 'COMPLETE',value: rates.completionRate },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {m.label}
                </p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: 11, color: '#6b7280' }}>Historical booking trend</p>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>7d avg</span>
            </div>
            <Sparkline points={SPARKLINE} />
          </div>

          {/* Quick action links */}
          <div className="space-y-2 mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
            {[
              { label: 'View Handoff Queue',    nav: 'conversations', dot: ov.pendingHandoffs > 0 ? '#ef4444' : '#22c55e' },
              { label: 'Doctor Availability',   nav: 'appointments',  dot: '#22c55e' },
              { label: 'Google Docs Sync',       nav: 'settings',      dot: '#22c55e' },
            ].map(item => (
              <button
                key={item.nav}
                onClick={() => onNavigate(item.nav)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                style={{ border: '1px solid #f3f4f6' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.dot }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{item.label}</span>
                </div>
                <ArrowRight style={{ width: 13, height: 13, color: '#d1d5db' }} className="group-hover:text-gray-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>Recent AI Activity</p>
          <button
            onClick={() => onNavigate('conversations')}
            className="btn-ghost"
            style={{ fontSize: 11, padding: '5px 10px' }}
          >
            View all
          </button>
        </div>
        <div className="space-y-0">
          {[
            { time: 'Just now', text: 'New WhatsApp enquiry received — Laser Hair Removal', dot: '#22c55e' },
            { time: '2m ago',   text: 'Lead qualified → Appointment booked with Dr. Ananya', dot: '#22c55e' },
            { time: '5m ago',   text: 'Human handoff triggered — complex pricing query', dot: '#ef4444' },
            { time: '12m ago',  text: 'Google Docs knowledge base synced successfully', dot: '#22c55e' },
            { time: '18m ago',  text: 'Appointment reminder sent — 3 patients via WhatsApp', dot: '#6b7280' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5 group"
              style={{ borderBottom: i < 4 ? '1px solid #f9fafb' : 'none' }}
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.dot }} />
              <span style={{ fontSize: 12, color: '#374151', flex: 1 }}>{item.text}</span>
              <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Overview;
