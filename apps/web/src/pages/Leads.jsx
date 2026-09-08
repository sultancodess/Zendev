import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Filter,
  Search,
  Phone,
  Calendar,
  Sparkles,
  Layers,
  Table,
  CheckCircle2,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { api } from '../services/api.js';

const STATUS_COLUMNS = ['NEW', 'QUALIFIED', 'BOOKING', 'BOOKED', 'COMPLETED', 'LOST'];

export function Leads() {
  const [leads, setLeads] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Acne & Breakouts Consultation',
    source: 'WhatsApp',
    status: 'NEW',
    notes: ''
  });

  const loadLeads = async () => {
    try {
      const data = await api.getLeads({
        status: statusFilter,
        source: sourceFilter,
        search
      });
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads', err);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter, sourceFilter, search]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      await loadLeads();
    } catch (err) {
      alert('Failed to update lead status: ' + err.message);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.createLead(formData);
      setShowModal(false);
      setFormData({
        name: '',
        phone: '',
        service: 'Acne & Breakouts Consultation',
        source: 'WhatsApp',
        status: 'NEW',
        notes: ''
      });
      await loadLeads();
    } catch (err) {
      alert('Failed to create lead: ' + err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.deleteLead(id);
      await loadLeads();
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="bg-[#0A0F18] p-5 rounded-2xl border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Leads Pipeline & CRM</h3>
            <p className="text-xs text-slate-400">Track inquiries from WhatsApp, Instagram & Website</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-emerald-500 text-black shadow-xs font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-emerald-500 text-black shadow-xs font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* New Lead Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0A0F18] p-3.5 rounded-2xl border border-zinc-800/90 shadow-md flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, phone, notes..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900/90 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        >
          <option value="ALL">All Statuses</option>
          {STATUS_COLUMNS.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        >
          <option value="ALL">All Sources</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Instagram">Instagram</option>
          <option value="Google">Google</option>
          <option value="Website">Website</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((status) => {
            const columnLeads = leads.filter((l) => l.status === status);
            return (
              <div key={status} className="bg-[#070b12] rounded-2xl p-3 flex flex-col min-w-[200px] border border-zinc-800/90">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-bold text-xs text-slate-300 uppercase tracking-wide">
                    {status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 text-[10px] font-bold border border-zinc-700">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#0f1624] p-3 rounded-xl border border-zinc-800/80 hover:border-emerald-500/40 shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">{lead.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-slate-300 border border-zinc-700">
                          {lead.source}
                        </span>
                      </div>

                      <p className="text-[11px] text-emerald-400/90 font-mono">{lead.phone}</p>
                      <p className="text-[11px] font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded-md line-clamp-1">
                        {lead.service}
                      </p>

                      {lead.notes && (
                        <p className="text-[10px] text-slate-400 bg-zinc-900 p-1.5 rounded border border-zinc-800/80 line-clamp-2">
                          {lead.notes}
                        </p>
                      )}

                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="text-[10px] font-semibold text-slate-300 bg-transparent border-0 focus:ring-0 cursor-pointer"
                        >
                          {STATUS_COLUMNS.map((st) => (
                            <option key={st} value={st} className="bg-zinc-900 text-white">{st}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#0A0F18] rounded-2xl border border-zinc-800/90 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 border-b border-zinc-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Service Interest</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="p-3.5 font-bold text-white">{lead.name}</td>
                    <td className="p-3.5 font-mono text-emerald-400">{lead.phone}</td>
                    <td className="p-3.5 font-medium text-slate-200">{lead.service}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-slate-300 font-semibold text-[10px] border border-zinc-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                      >
                        {STATUS_COLUMNS.map((st) => (
                          <option key={st} value={st} className="bg-zinc-900 text-white">{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0F18] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h4 className="font-bold text-base text-white">Add New Lead</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+919876543210"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Interest</label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google</option>
                    <option value="Website">Website</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                  >
                    {STATUS_COLUMNS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clinical Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Primary concerns, past treatments..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold shadow-[0_0_15px_rgba(34,197,94,0.3)]"
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
