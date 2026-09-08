import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Layers, Table2, Trash2, X } from 'lucide-react';
import { api } from '../services/api.js';

const STATUSES = ['NEW','QUALIFIED','BOOKING','BOOKED','COMPLETED','LOST'];
const STATUS_COLORS = {
  NEW:       { bg: '#dbeafe', color: '#1e40af' },
  QUALIFIED: { bg: '#dcfce7', color: '#15803d' },
  BOOKING:   { bg: '#fef9c3', color: '#92400e' },
  BOOKED:    { bg: '#dcfce7', color: '#15803d' },
  COMPLETED: { bg: '#f0fdf4', color: '#166534' },
  LOST:      { bg: '#fee2e2', color: '#991b1b' },
};
const KANBAN_COLORS = {
  NEW:       '#3b82f6',
  QUALIFIED: '#22c55e',
  BOOKING:   '#f59e0b',
  BOOKED:    '#10b981',
  COMPLETED: '#6b7280',
  LOST:      '#ef4444',
};

const BLANK = { name:'', phone:'', service:'Acne & Breakouts Consultation', source:'WhatsApp', status:'NEW', notes:'' };

function StatusTag({ s }) {
  const m = STATUS_COLORS[s] || STATUS_COLORS.NEW;
  return <span className="tag" style={{ ...m, fontSize: 10 }}>{s}</span>;
}

export function Leads() {
  const [leads,   setLeads]   = useState([]);
  const [view,    setView]    = useState('kanban');
  const [search,  setSearch]  = useState('');
  const [stFilter,setStFilter]= useState('ALL');
  const [srcFilter,setSrcFilter]=useState('ALL');
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(BLANK);

  const load = async () => {
    try { setLeads(await api.getLeads({ status: stFilter, source: srcFilter, search })); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, [stFilter, srcFilter, search]);

  const updateStatus = async (id, s) => { try { await api.updateLead(id, { status: s }); await load(); } catch (e) { alert(e.message); } };
  const create = async (e) => { e.preventDefault(); try { await api.createLead(form); setModal(false); setForm(BLANK); await load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm('Delete lead?')) return; try { await api.deleteLead(id); await load(); } catch (e) { alert(e.message); } };

  const selectCls = 'input-base';

  return (
    <div className="space-y-4">
      {/* Title + actions */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Leads Pipeline</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>WhatsApp, Instagram & Website inbound leads</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            {[['kanban', Layers], ['table', Table2]].map(([id, Icon]) => (
              <button key={id} onClick={() => setView(id)}
                style={{ padding: '6px 12px', background: view === id ? '#111' : 'transparent', color: view === id ? '#fff' : '#9ca3af', border: 'none', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                <Icon style={{ width: 13, height: 13 }} />
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setModal(true)} className="btn-primary" style={{ fontSize: 12 }}>
            <Plus style={{ width: 13, height: 13 }} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="panel p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…" className="input-base" style={{ paddingLeft: 30, height: 34, fontSize: 12 }} />
        </div>
        <select value={stFilter} onChange={e => setStFilter(e.target.value)} className={selectCls} style={{ height: 34, fontSize: 12, width: 130 }}>
          <option value="ALL">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={srcFilter} onChange={e => setSrcFilter(e.target.value)} className={selectCls} style={{ height: 34, fontSize: 12, width: 130 }}>
          <option value="ALL">All Sources</option>
          {['WhatsApp','Instagram','Google','Website','Manual'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Kanban */}
      {view === 'kanban' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATUSES.map(status => {
            const col = leads.filter(l => l.status === status);
            const c = KANBAN_COLORS[status];
            return (
              <div key={status} className="panel p-3" style={{ minWidth: 160 }}>
                <div className="flex items-center justify-between mb-3" style={{ borderBottom: `2px solid ${c}20`, paddingBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: c, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{status}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, background: `${c}15`, color: c, padding: '1px 6px', borderRadius: 99 }}>{col.length}</span>
                </div>
                <div className="space-y-2 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 22rem)' }}>
                  {col.map(lead => (
                    <div key={lead.id} className="p-2.5 rounded-lg group" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#111', marginBottom: 3 }}>{lead.name}</p>
                      <p style={{ fontSize: 10, color: '#22c55e', fontFamily: 'monospace', marginBottom: 5 }}>{lead.phone}</p>
                      <p style={{ fontSize: 10, color: c, background: `${c}12`, padding: '2px 6px', borderRadius: 4, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.service}
                      </p>
                      <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid #f3f4f6' }}>
                        <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                          style={{ fontSize: 10, fontWeight: 700, background: 'transparent', border: 'none', color: c, cursor: 'pointer', outline: 'none', maxWidth: 80 }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => remove(lead.id)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#d1d5db', cursor: 'pointer', background: 'none', border: 'none', padding: 2 }}>
                          <Trash2 style={{ width: 11, height: 11 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {col.length === 0 && <p style={{ fontSize: 11, color: '#d1d5db', textAlign: 'center', padding: '16px 0' }}>Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full text-left">
            <thead className="tbl-head">
              <tr>{['Name','Phone','Service','Source','Status','Created',''].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={l.id} className="tbl-row group">
                  <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{l.name}</td>
                  <td className="px-4 py-3" style={{ fontSize: 12, color: '#22c55e', fontFamily: 'monospace' }}>{l.phone}</td>
                  <td className="px-4 py-3" style={{ fontSize: 12, color: '#374151', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.service}</td>
                  <td className="px-4 py-3"><span className="tag tag-gray" style={{ fontSize: 10 }}>{l.source}</span></td>
                  <td className="px-4 py-3"><StatusTag s={l.status} /></td>
                  <td className="px-4 py-3" style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(l.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-50" style={{ color: '#d1d5db', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && <div className="py-12 text-center" style={{ fontSize: 13, color: '#9ca3af' }}>No leads found</div>}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" style={{ border: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Add New Lead</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <form onSubmit={create} className="p-5 space-y-3.5">
              {[['Patient Name','name','text','e.g. Rahul Verma'],['WhatsApp Number','phone','text','+919876543210']].map(([label,key,type,ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input type={type} required value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={ph} className="input-base" style={{ fontSize: 13, height: 36, fontFamily: key === 'phone' ? 'monospace' : 'inherit' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Service</label>
                <input value={form.service} onChange={e => setForm({...form,service:e.target.value})} className="input-base" style={{ fontSize: 13, height: 36 }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Source','source',['WhatsApp','Instagram','Google','Website','Manual']],['Status','status',STATUSES]].map(([label,key,opts]) => (
                  <div key={key}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{label}</label>
                    <select value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="input-base" style={{ fontSize: 13, height: 36 }}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} placeholder="Primary concerns…" className="input-base" style={{ fontSize: 13, resize: 'none' }} />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost" style={{ fontSize: 12 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ fontSize: 12 }}>Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Leads;
