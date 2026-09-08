import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, RefreshCw, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';
import { api } from '../services/api.js';

function Section({ title, subtitle, children }) {
  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

export function Settings() {
  const [gStatus,    setGStatus]    = useState(null);
  const [docId,      setDocId]      = useState('');
  const [clinic,     setClinic]     = useState({ name:'', phone:'', address:'', working_hours:'' });
  const [auditLogs,  setAuditLogs]  = useState([]);
  const [syncing,    setSyncing]    = useState(false);
  const [toggling,   setToggling]   = useState(false);
  const [saved,      setSaved]      = useState(false);

  const load = async () => {
    try {
      const [g, c, logs] = await Promise.all([api.getGoogleDocsStatus(), api.getClinic(), api.getAuditLogs()]);
      setGStatus(g); setDocId(g.doc_id || ''); setClinic(c); setAuditLogs(logs);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async () => { if (toggling) return; setToggling(true); try { await api.toggleGoogleDocsSync(!gStatus?.enabled); await load(); } catch (e) { alert(e.message); } finally { setToggling(false); } };
  const sync   = async () => { if (syncing) return; setSyncing(true); try { const r = await api.syncGoogleDocsNow(docId); alert(r.message); await load(); } catch (e) { alert(e.message); } finally { setSyncing(false); } };
  const save   = async (e) => { e.preventDefault(); try { await api.updateClinic(clinic); setSaved(true); setTimeout(() => setSaved(false), 2500); await load(); } catch (e) { alert(e.message); } };

  const on = gStatus?.enabled;

  return (
    <div className="space-y-4 page-enter">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Integrations, clinic config & compliance logs</p>
      </div>

      {/* Google Docs */}
      <Section title="Google Docs & Sheets Integration" subtitle="Sync clinic knowledge from Google Docs, stream leads to Sheets">
        <div className="flex items-center justify-between p-3.5 rounded-xl mb-5" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${on ? '' : ''}`} style={{ background: on ? '#22c55e' : '#d1d5db', animation: on ? 'pulse 2s infinite' : 'none' }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{on ? 'Integration Active' : 'Integration Disabled'}</p>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>
                {gStatus?.extracted_faqs_count || 0} FAQs synced · Last: {gStatus?.last_synced_at ? new Date(gStatus.last_synced_at).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
          <button onClick={toggle} className={on ? 'btn-primary' : 'btn-ghost'} style={{ fontSize: 12, padding: '6px 14px' }}>
            {on ? <ToggleRight style={{ width: 14, height: 14 }} /> : <ToggleLeft style={{ width: 14, height: 14 }} />}
            {on ? 'Enabled' : 'Enable'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Google Doc ID" hint="Configure via ENABLE_GOOGLE_DOCS_SYNC in .env">
            <input value={docId} onChange={e => setDocId(e.target.value)} placeholder="1_sample_google_doc_id" className="input-base" style={{ fontSize: 12, height: 36, fontFamily: 'monospace' }} />
          </Field>
          <Field label="Google Sheet ID (read-only)" hint="Auto-exports leads in real-time">
            <input readOnly value={gStatus?.sheet_id || 'sheet_derma_live_leads'} className="input-base" style={{ fontSize: 12, height: 36, fontFamily: 'monospace', opacity: 0.5 }} />
          </Field>
        </div>
        <div className="flex justify-end">
          <button onClick={sync} disabled={!on || syncing} className="btn-primary" style={{ fontSize: 12, opacity: (!on || syncing) ? 0.5 : 1 }}>
            <RefreshCw style={{ width: 13, height: 13, animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
        </div>
      </Section>

      {/* Clinic Details */}
      <Section title="Clinic Details" subtitle="Used by AI when responding to location & contact enquiries">
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Clinic Name">
              <input required value={clinic.name || ''} onChange={e => setClinic({...clinic, name: e.target.value})} className="input-base" style={{ fontSize: 13, height: 36 }} />
            </Field>
            <Field label="WhatsApp Number">
              <input required value={clinic.phone || ''} onChange={e => setClinic({...clinic, phone: e.target.value})} className="input-base" style={{ fontSize: 13, height: 36, fontFamily: 'monospace', color: '#22c55e' }} />
            </Field>
          </div>
          <Field label="Address">
            <input value={clinic.address || ''} onChange={e => setClinic({...clinic, address: e.target.value})} className="input-base" style={{ fontSize: 13, height: 36 }} />
          </Field>
          <Field label="Working Hours">
            <input value={clinic.working_hours || ''} onChange={e => setClinic({...clinic, working_hours: e.target.value})} placeholder="Mon–Sat 10am–7pm" className="input-base" style={{ fontSize: 13, height: 36 }} />
          </Field>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" style={{ fontSize: 12 }}>
              {saved ? <><CheckCircle2 style={{ width: 14, height: 14 }} />Saved!</> : 'Update Details'}
            </button>
          </div>
        </form>
      </Section>

      {/* Audit Log */}
      <Section title="Audit Trail" subtitle="DPDP Act compliance — immutable staff action logs">
        <div className="overflow-hidden rounded-lg" style={{ border: '1px solid #e5e7eb', maxHeight: 280, overflowY: 'auto' }}>
          <table className="w-full text-left">
            <thead className="tbl-head">
              <tr>{['Timestamp','Action','User','Entity'].map(h => <th key={h} className="px-4 py-2.5">{h}</th>)}</tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} className="tbl-row">
                  <td className="px-4 py-2.5" style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2.5" style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>{log.action}</td>
                  <td className="px-4 py-2.5" style={{ fontSize: 12, color: '#374151' }}>{log.user_id}</td>
                  <td className="px-4 py-2.5" style={{ fontSize: 12, color: '#6b7280' }}>{log.entity}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center" style={{ fontSize: 12, color: '#9ca3af' }}>No audit logs yet</td></tr>}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
export default Settings;
