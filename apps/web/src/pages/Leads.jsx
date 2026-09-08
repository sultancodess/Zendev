import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, Layers, Table, Trash2, X, Phone,
} from 'lucide-react';
import { api } from '../services/api.js';

const STATUS_COLUMNS = ['NEW', 'QUALIFIED', 'BOOKING', 'BOOKED', 'COMPLETED', 'LOST'];

const STATUS_META = {
  NEW:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
  QUALIFIED: { color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)' },
  BOOKING:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  },
  BOOKED:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)'   },
  COMPLETED: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  LOST:      { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.25)'   },
};

const INITIAL_FORM = {
  name: '', phone: '',
  service: 'Acne & Breakouts Consultation',
  source: 'WhatsApp', status: 'NEW', notes: ''
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.NEW;
  return (
    <span
      className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}
    >
      {status}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const selectCls = 'w-full px-3 py-2 text-xs rounded-xl border border-dark-700 bg-dark-850 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50';

export function Leads() {
  const [leads,        setLeads]        = useState([]);
  const [viewMode,     setViewMode]     = useState('kanban');
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [showModal,    setShowModal]    = useState(false);
  const [formData,     setFormData]     = useState(INITIAL_FORM);

  const loadLeads = async () => {
    try {
      const data = await api.getLeads({ status: statusFilter, source: sourceFilter, search });
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads', err);
    }
  };

  useEffect(() => { loadLeads(); }, [statusFilter, sourceFilter, search]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      await loadLeads();
    } catch (err) {
      alert('Failed to update lead: ' + err.message);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.createLead(formData);
      setShowModal(false);
      setFormData(INITIAL_FORM);
      await loadLeads();
    } catch (err) {
      alert('Failed to create lead: ' + err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.deleteLead(id);
      await loadLeads();
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  return (
    <div className="space-y-4 page-enter">

      {/* ── Header ── */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Leads Pipeline & CRM</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">WhatsApp, Instagram & Website inbound leads</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div
            className="flex items-center p-1 rounded-xl border border-white/5"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            {[
              { id: 'kanban', icon: Layers, label: 'Kanban' },
              { id: 'table',  icon: Table,  label: 'Table'  },
            ].map(v => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === v.id
                      ? 'bg-emerald-500 text-black'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {v.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-glow px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-[11px] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Lead
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, notes…"
            className="w-full input-dark pl-8 text-[11px]"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectCls + ' sm:w-36'}>
          <option value="ALL">All Statuses</option>
          {STATUS_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className={selectCls + ' sm:w-36'}>
          <option value="ALL">All Sources</option>
          {['WhatsApp','Instagram','Google','Website','Manual'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Kanban ── */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
          {STATUS_COLUMNS.map(status => {
            const m = STATUS_META[status];
            const col = leads.filter(l => l.status === status);
            return (
              <div
                key={status}
                className="rounded-2xl p-3 flex flex-col min-w-[190px]"
                style={{
                  background: 'rgba(6,9,15,0.7)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {/* Column header */}
                <div
                  className="flex items-center justify-between mb-3 px-1 pb-2"
                  style={{ borderBottom: `1px solid ${m.border}` }}
                >
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider"
                    style={{ color: m.color }}
                  >
                    {status}
                  </span>
                  <span
                    className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                    style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}
                  >
                    {col.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-22rem)]">
                  {col.map(lead => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all space-y-2 group"
                      style={{ background: 'rgba(15,22,36,0.8)' }}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-[11px] text-white leading-tight">{lead.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-dark-750 text-slate-400 border border-white/5 whitespace-nowrap">
                          {lead.source}
                        </span>
                      </div>

                      <p className="text-[10px] text-emerald-400 font-mono">{lead.phone}</p>

                      <p className="text-[10px] font-medium px-2 py-1 rounded-lg line-clamp-1"
                        style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}
                      >
                        {lead.service}
                      </p>

                      {lead.notes && (
                        <p className="text-[10px] text-slate-500 bg-dark-900/60 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                          {lead.notes}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <select
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value)}
                          className="text-[10px] font-bold bg-transparent border-0 focus:ring-0 cursor-pointer text-slate-400 hover:text-white transition-colors"
                          style={{ color: m.color }}
                        >
                          {STATUS_COLUMNS.map(st => <option key={st} value={st} className="bg-dark-900 text-white">{st}</option>)}
                        </select>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 p-1 rounded transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {col.length === 0 && (
                    <div className="text-center py-6 text-slate-700 text-[10px] font-medium">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Table View ── */
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <tr>
                  {['Name','Phone','Service Interest','Source','Status','Created',''].map(h => (
                    <th key={h} className="p-3.5 text-[9px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className="group transition-colors"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <td className="p-3.5 font-bold text-[11px] text-white">{lead.name}</td>
                    <td className="p-3.5 font-mono text-[11px] text-emerald-400">{lead.phone}</td>
                    <td className="p-3.5 text-[11px] text-slate-300 max-w-[180px] truncate">{lead.service}</td>
                    <td className="p-3.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-dark-750 text-slate-400 border border-white/5">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="p-3.5 text-[10px] text-slate-500 font-mono whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-xs">No leads found</div>
            )}
          </div>
        </div>
      )}

      {/* ── Add Lead Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div
            className="rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, #0a1020, #0c1428)',
              border: '1px solid rgba(34,197,94,0.25)',
              boxShadow: '0 0 60px rgba(34,197,94,0.08), 0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between mb-5 pb-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white">Add New Lead</h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <Field label="Patient Name">
                <input
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full input-dark"
                />
              </Field>

              <Field label="WhatsApp Number">
                <input
                  type="text" required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+919876543210"
                  className="w-full input-dark font-mono"
                />
              </Field>

              <Field label="Service Interest">
                <input
                  type="text"
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                  className="w-full input-dark"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Source">
                  <select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className={selectCls}>
                    {['WhatsApp','Instagram','Google','Website','Manual'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={selectCls}>
                    {STATUS_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Clinical Notes">
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Primary concerns, past treatments…"
                  className="w-full input-dark resize-none"
                />
              </Field>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-glow px-5 py-2 rounded-xl bg-emerald-500 text-black text-[11px] font-extrabold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;
