import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Sparkles, CalendarCheck, AlertCircle,
  TrendingUp, TrendingDown, ArrowRight, RefreshCw,
  Clock, CheckCircle2, User, ChevronRight, AlertTriangle, X
} from 'lucide-react';
import { api } from '../services/api.js';

/* ── Hourly Throughput Data ── */
const HOURLY_DATA = [
  { time: '04:00', count: 1, label: '4 AM' },
  { time: '06:00', count: 3, label: '6 AM' },
  { time: '08:00', count: 6, label: '8 AM' },
  { time: '10:00', count: 12, label: '10 AM', peak: true },
  { time: '12:00', count: 9, label: '12 PM' },
  { time: '14:00', count: 7, label: '2 PM' },
  { time: '16:00', count: 8, label: '4 PM' },
  { time: '18:00', count: 11, label: '6 PM', peak: true },
  { time: '20:00', count: 5, label: '8 PM' },
  { time: '22:00', count: 2, label: '10 PM' },
];

/* ── Functional SVG Bar Chart with Gridlines, Axis & Hover State ── */
function FunctionalThroughputChart({ data = HOURLY_DATA }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const chartHeight = 160;
  const chartWidth = 560;
  const paddingLeft = 32;
  const paddingBottom = 26;
  const paddingTop = 12;
  const paddingRight = 16;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const maxY = 16; // fixed scale for consistency

  const gridSteps = [16, 12, 8, 4, 0];
  const barSlotWidth = innerWidth / data.length;
  const barWidth = Math.min(24, barSlotWidth * 0.58);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* SVG Container */}
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible"
        style={{ minHeight: 180 }}
      >
        {/* Horizontal Dotted Gridlines & Y-Axis Labels */}
        {gridSteps.map(step => {
          const y = paddingTop + innerHeight - (step / maxY) * innerHeight;
          return (
            <g key={step}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray={step === 0 ? 'none' : '3 3'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="#9ca3af"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="500"
              >
                {step}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = paddingLeft + i * barSlotWidth + (barSlotWidth - barWidth) / 2;
          const barH = Math.max(4, (d.count / maxY) * innerHeight);
          const y = paddingTop + innerHeight - barH;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={d.time}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Invisible touch target hit area */}
              <rect
                x={paddingLeft + i * barSlotWidth}
                y={paddingTop}
                width={barSlotWidth}
                height={innerHeight}
                fill="transparent"
              />

              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="3"
                fill={isHovered ? '#16a34a' : d.peak ? '#111827' : '#374151'}
                className="transition-all duration-150"
                opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
              />

              {/* Peak indicator dot */}
              {d.peak && !isHovered && (
                <circle
                  cx={x + barWidth / 2}
                  cy={y - 5}
                  r="2"
                  fill="#16a34a"
                />
              )}

              {/* X-Axis Time Label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 6}
                textAnchor="middle"
                fontSize="10"
                fill={isHovered ? '#111827' : '#9ca3af'}
                fontWeight={isHovered ? '700' : '500'}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute bg-gray-900 text-white px-2.5 py-1.5 rounded-lg shadow-xl text-xs pointer-events-none transition-all duration-75 flex items-center gap-2 border border-gray-700"
          style={{
            left: `${((paddingLeft + hoveredIdx * barSlotWidth + barSlotWidth / 2) / chartWidth) * 100}%`,
            top: '12px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-gray-200">{HOURLY_DATA[hoveredIdx].time}:</span>
          <span className="font-bold text-white font-mono">{HOURLY_DATA[hoveredIdx].count} inquiries</span>
          {HOURLY_DATA[hoveredIdx].peak && (
            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded uppercase">
              Peak
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sparkline SVG ── */
function FunnelSparkline({ points = [12, 14, 11, 18, 15, 20, 24] }) {
  const w = 180, h = 36;
  const max = Math.max(...points, 1);
  const min = Math.min(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / range) * (h - 10) - 5);
  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9">
      <path
        d={pathD}
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r={i === xs.length - 1 ? 3 : 1.5}
          fill={i === xs.length - 1 ? '#16a34a' : '#9ca3af'}
        />
      ))}
    </svg>
  );
}

/* ── Skeleton Loading Layout ── */
function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="skeleton w-48 h-7" />
          <div className="skeleton w-72 h-4" />
        </div>
        <div className="skeleton w-24 h-8 rounded-lg" />
      </div>

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card p-5 space-y-3">
            <div className="flex justify-between">
              <div className="skeleton w-24 h-3" />
              <div className="skeleton w-5 h-5 rounded-md" />
            </div>
            <div className="skeleton w-20 h-9" />
            <div className="skeleton w-32 h-3" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2 space-y-4">
          <div className="skeleton w-44 h-5" />
          <div className="skeleton w-full h-44" />
        </div>
        <div className="card p-5 space-y-4">
          <div className="skeleton w-36 h-5" />
          <div className="skeleton w-full h-44" />
        </div>
      </div>
    </div>
  );
}

export function Overview({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [alertDismissed, setAlertDismissed] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load overview data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return <OverviewSkeleton />;
  }

  const ov = data?.overview || {
    totalEnquiries: 24,
    qualifiedLeads: 16,
    totalBookedAppointments: 10,
    completedAppointments: 6,
    pendingHandoffs: 2,
    noShowAppointments: 1,
  };

  const rates = data?.rates || {
    qualificationRate: '66.7%',
    bookingRate: '41.7%',
    completionRate: '60.0%',
  };

  // Metric cards with strict hierarchy & trend context
  const STATS = [
    {
      id: 'enquiries',
      label: 'WhatsApp Enquiries',
      value: ov.totalEnquiries,
      trend: '+18.4%',
      trendUp: true,
      comparison: 'vs yesterday (20)',
      subtext: '100% replied in <1.2s avg',
      icon: MessageSquare,
      alert: false,
    },
    {
      id: 'qualification',
      label: 'Qualification Rate',
      value: rates.qualificationRate,
      trend: '+4.5%',
      trendUp: true,
      comparison: 'vs 7d avg (62.2%)',
      subtext: '16 of 24 leads triaged by AI',
      icon: Sparkles,
      alert: false,
    },
    {
      id: 'booked',
      label: 'Booked Appointments',
      value: ov.totalBookedAppointments,
      trend: '+25.0%',
      trendUp: true,
      comparison: 'vs yesterday (8)',
      subtext: '41.7% conversation-to-booking',
      icon: CalendarCheck,
      alert: false,
    },
    {
      id: 'handoffs',
      label: 'Pending Handoffs',
      value: ov.pendingHandoffs,
      trend: ov.pendingHandoffs > 0 ? 'Needs Attention' : 'All Clear',
      trendUp: false,
      comparison: ov.pendingHandoffs > 0 ? 'Action required' : 'SLA maintained',
      subtext: ov.pendingHandoffs > 0 ? 'Patients waiting for receptionist' : 'Zero queue latency',
      icon: AlertCircle,
      alert: ov.pendingHandoffs > 0,
    },
  ];

  const recentPatients = [
    {
      name: 'Sunita Krishnamurthy',
      phone: '+91 98201 44521',
      service: 'HydraFacial Elite',
      time: '3m ago',
      status: 'HANDOFF',
      statusLabel: 'Handoff Waiting',
      statusColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      name: 'Rahul Varma',
      phone: '+91 98450 19283',
      service: 'Laser Hair Reduction',
      time: '14m ago',
      status: 'BOOKED',
      statusLabel: 'Booked (Dr. Ananya)',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'Priya Nambiar',
      phone: '+91 97412 88410',
      service: 'Chemical Peel & Acne Care',
      time: '28m ago',
      status: 'QUALIFIED',
      statusLabel: 'AI Qualified',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'Devraj Sen',
      phone: '+91 99001 23419',
      service: 'Tattoo Removal Consultation',
      time: '45m ago',
      status: 'AI_ACTIVE',
      statusLabel: 'AI Conversing',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    },
  ];

  return (
    <div className="space-y-6 page-enter pb-10">

      {/* ── 1. "Needs Attention" Global Alert Strip (Always prominent if handoffs exist) ── */}
      {ov.pendingHandoffs > 0 && !alertDismissed && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-amber-900">
                  {ov.pendingHandoffs} Patient{ov.pendingHandoffs > 1 ? 's' : ''} Require Human Escalation
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Urgent
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Patients requested complex clinical quotes or doctor consults exceeding AI scope.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => onNavigate('conversations')}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-900 hover:bg-black text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Take Over in Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAlertDismissed(true)}
              className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-100 transition-colors"
              title="Acknowledge for now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── 2. Page Header with Breadcrumb Context & Quick Refresh ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Patient Pipeline Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Autonomous WhatsApp AI triage & booking engine for{' '}
            <span className="font-semibold text-gray-800">DermaCare Skin & Laser Clinic</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs">
            {['24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all shadow-2xs active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── 3. Four Sacred Stat Cards (Numbers are the Hero) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`stat-card p-5 bg-white rounded-xl border transition-all duration-200 relative overflow-hidden ${
                stat.alert
                  ? 'border-red-300 bg-red-50/20 shadow-xs'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              {/* Top row: Label & Icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    stat.alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Number as Hero (36px, tabular numerals) */}
              <div className="flex items-baseline gap-2.5 my-1">
                <span
                  className={`text-3xl sm:text-4xl font-black tracking-tight font-mono ${
                    stat.alert ? 'text-red-600' : 'text-gray-950'
                  }`}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {stat.value}
                </span>

                {/* Trend Badge */}
                {stat.alert ? (
                  <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    Action
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    {stat.trend}
                  </span>
                )}
              </div>

              {/* Trend Comparison and Context */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium truncate">{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. Main Data Row: Functional SVG Chart (2/3) & Conversion Funnel (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* 4A. Throughput Chart Card (2 Columns) */}
        <div className="card p-6 lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header & Sub-KPIs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-950">
                  WhatsApp Message Throughput
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Inbound customer inquiries grouped by 2-hour intervals
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-900" />
                  <span className="text-gray-600 font-medium">Standard Volume</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
                  <span className="text-gray-600 font-medium">Peak Hour</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Delivered Messages
                </span>
                <span className="text-lg font-black text-gray-900 font-mono">
                  {ov.totalEnquiries - ov.pendingHandoffs}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Avg SLA Response
                </span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  1.18s
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Staff Takeovers
                </span>
                <span className={`text-lg font-black font-mono ${ov.pendingHandoffs > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {ov.pendingHandoffs}
                </span>
              </div>
            </div>

            {/* Functional Chart Canvas */}
            <FunctionalThroughputChart />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Peak clinic activity recorded between <strong>10:00 AM – 12:00 PM</strong></span>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <span>Full analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4B. Conversion Funnel & Pipeline Health (1 Column) */}
        <div className="card p-6 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-950">Conversion Funnel</h3>
                <p className="text-xs text-gray-500">Inquiry to consultation journey</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {rates.bookingRate} Net
              </span>
            </div>

            {/* Funnel Progress Bars */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">1. Inbound WhatsApp Leads</span>
                  <span className="text-gray-950 font-bold font-mono">24 (100%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">2. AI Qualified (Needs Identified)</span>
                  <span className="text-gray-950 font-bold font-mono">16 (66.7%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '66.7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">3. Appointments Booked</span>
                  <span className="text-gray-950 font-bold font-mono">10 (41.7%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '41.7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">4. Treatments Completed</span>
                  <span className="text-gray-950 font-bold font-mono">6 (60.0%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '25.0%' }} />
                </div>
              </div>
            </div>

            {/* 7-Day Trend Sparkline */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">7-Day Booking Velocity</span>
                <span className="text-xs text-emerald-600 font-bold font-mono">+32% WoW</span>
              </div>
              <FunnelSparkline />
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <button
              onClick={() => onNavigate('appointments')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-semibold text-gray-700 group"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Doctor Calendars & Slots</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
            </button>

            <button
              onClick={() => onNavigate('faqs')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-semibold text-gray-700 group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Clinical Google Docs Sync</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. Live Patient Activity Table (Design with Real Data & Empty States) ── */}
      <div className="card bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-950">Recent WhatsApp Patient Activity</h3>
            <p className="text-xs text-gray-500">Autonomous conversation stream & triage status</p>
          </div>

          <button
            onClick={() => onNavigate('conversations')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-center"
          >
            <span>Open live chat inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base w-full">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Service Requested</th>
                <th>Triage Status</th>
                <th>Elapsed</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-snug">{p.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{p.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      {p.service}
                    </span>
                  </td>
                  <td>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${p.statusColor}`}>
                      {p.statusLabel}
                    </span>
                  </td>
                  <td className="text-xs text-gray-400 font-mono whitespace-nowrap">
                    {p.time}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onNavigate('conversations')}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                        p.status === 'HANDOFF'
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-2xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {p.status === 'HANDOFF' ? 'Take Over' : 'View Chat'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Overview;
