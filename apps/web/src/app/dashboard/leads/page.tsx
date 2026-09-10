'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Phone,
  Tag,
  Calendar,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Lead, LeadStatus } from '@dermo/types';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'NEW', label: 'New Enquiries', color: 'border-blue-500/60 bg-blue-500/10 text-blue-400' },
  { id: 'CONTACTED', label: 'Contacted', color: 'border-amber-500/60 bg-amber-500/10 text-amber-400' },
  { id: 'QUALIFIED', label: 'Qualified (High Intent)', color: 'border-purple-500/60 bg-purple-500/10 text-purple-400' },
  { id: 'APPOINTMENT_BOOKED', label: 'Appointment Booked', color: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400' },
  { id: 'CONVERTED', label: 'Converted', color: 'border-teal-500/60 bg-teal-500/10 text-teal-400' },
  { id: 'LOST', label: 'Lost / Closed', color: 'border-slate-500/60 bg-slate-500/10 text-slate-400' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newConcern, setNewConcern] = useState('');
  const [newSource, setNewSource] = useState<'WHATSAPP' | 'WEBSITE' | 'WALK_IN' | 'INSTAGRAM'>('WHATSAPP');

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      await loadLeads();
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    try {
      await api.createLead({
        name: newName,
        phone: newPhone,
        primaryConcern: newConcern,
        source: newSource,
        status: 'NEW',
        tags: [newSource, 'Manual'],
      });
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      setNewConcern('');
      await loadLeads();
    } catch (err) {
      console.error('Failed to create lead:', err);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Clinic Leads & Patient Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track inquiries from WhatsApp, website, and Instagram across conversion stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 max-w-md bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, phone, or treatment tag..."
          className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="glass-card rounded-2xl p-3 border border-slate-800/90 flex flex-col min-w-[240px] bg-[#0c121e]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${stage.color.split(' ')[2]}`} />
                    <h3 className="font-bold text-xs text-white truncate">{stage.label}</h3>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-white">{lead.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-semibold text-emerald-400 border border-slate-700">
                          {lead.source}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{lead.phone}</span>
                      </div>

                      {lead.primaryConcern && (
                        <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                          {lead.primaryConcern}
                        </p>
                      )}

                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {lead.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[9px] border border-emerald-900/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Status Selector Dropdown */}
                      <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">Move to:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                          className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-emerald-400 focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-slate-600 text-[11px]">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Primary Concern</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-white">{lead.name}</td>
                  <td className="p-3.5 font-mono text-slate-400">{lead.phone}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-emerald-400 border border-slate-700">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-xs truncate">{lead.primaryConcern || '—'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-700 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Create New Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Concern / Treatment Inquiry</label>
                <input
                  type="text"
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  placeholder="e.g. HydraFacial, Acne Scar Treatment"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inquiry Source</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="WEBSITE">Website</option>
                  <option value="WALK_IN">Walk-in</option>
                  <option value="INSTAGRAM">Instagram</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
