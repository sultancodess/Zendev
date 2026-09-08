import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { api } from '../services/api.js';

function Bar({ pct, color }) {
  return (
    <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: pct, background: color, borderRadius: 99, transition: 'width 0.8s ease' }} />
    </div>
  );
}

export function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { api.getAnalytics().then(setData).catch(console.error); }, []);

  const rates = data?.rates || {};
  const src   = data?.sourceBreakdown  || [];
  const svc   = data?.serviceBreakdown || [];
  const srcMax = Math.max(...src.map(i => i.count), 1);
  const svcMax = Math.max(...svc.map(i => i.count), 1);

  const KPIs = [
    { label: 'QUALIFICATION RATE', value: rates.qualificationRate || '—', sub: 'Qualified / Total Enquiries', color: '#22c55e' },
    { label: 'BOOKING RATE',       value: rates.bookingRate       || '—', sub: 'Booked / Qualified Leads',    color: '#3b82f6' },
    { label: 'COMPLETION RATE',    value: rates.completionRate    || '—', sub: 'Completed / Total Booked',    color: '#8b5cf6' },
    { label: 'NO-SHOW RATE',       value: rates.noShowRate        || '—', sub: 'No-Shows / Total Booked',     color: '#f59e0b' },
  ];

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Analytics</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Performance metrics and conversion funnel data</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIs.map(k => (
          <div key={k.label} className="stat-card p-5">
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{k.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: k.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source */}
        <div className="panel p-5">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2 }}>Lead Source Attribution</p>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Where patients find you</p>
          <div className="space-y-4">
            {src.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5" style={{ fontSize: 12 }}>
                  <span style={{ fontWeight: 500, color: '#374151' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: '#22c55e', fontFamily: 'monospace' }}>{item.count}</span>
                </div>
                <Bar pct={`${Math.round((item.count / srcMax) * 100)}%`} color="#22c55e" />
              </div>
            ))}
            {src.length === 0 && <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: 24 }}>No data yet</p>}
          </div>
        </div>

        {/* Service */}
        <div className="panel p-5">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2 }}>Treatment Demand</p>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Most enquired services</p>
          <div className="space-y-4">
            {svc.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5" style={{ fontSize: 12 }}>
                  <span style={{ fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: '#8b5cf6', fontFamily: 'monospace' }}>{item.count}</span>
                </div>
                <Bar pct={`${Math.round((item.count / svcMax) * 100)}%`} color="#8b5cf6" />
              </div>
            ))}
            {svc.length === 0 && <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: 24 }}>No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Analytics;
