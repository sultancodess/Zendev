import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, FileSpreadsheet, RefreshCw,
  Shield, Building, ToggleLeft, ToggleRight, CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api.js';

function SectionCard({ title, subtitle, icon: Icon, iconColor = 'text-emerald-400', iconBg = 'bg-emerald-500/15', children, className = '' }) {
  return (
    <div className={`glass-card rounded-2xl overflow-hidden ${className}`}>
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}
      >
        <div className={`w-9 h-9 rounded-xl ${iconBg} border border-white/10 flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: '1.1rem', height: '1.1rem' }} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">{title}</h4>
          {subtitle && <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FormField({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full input-dark text-[11px]';

export function Settings() {
  const [googleDocsStatus, setGoogleDocsStatus] = useState(null);
  const [docIdInput,       setDocIdInput]        = useState('');
  const [auditLogs,        setAuditLogs]         = useState([]);
  const [clinicInfo,       setClinicInfo]        = useState({ name: '', phone: '', email: '', address: '', working_hours: '' });
  const [syncing,          setSyncing]           = useState(false);
  const [toggling,         setToggling]          = useState(false);
  const [saved,            setSaved]             = useState(false);

  const loadData = async () => {
    try {
      const [gStatus, clinic, logs] = await Promise.all([
        api.getGoogleDocsStatus(),
        api.getClinic(),
        api.getAuditLogs(),
      ]);
      setGoogleDocsStatus(gStatus);
      setDocIdInput(gStatus.doc_id || '');
      setClinicInfo(clinic);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleGoogleDocs = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await api.toggleGoogleDocsSync(!googleDocsStatus?.enabled);
      await loadData();
    } catch (err) {
      alert('Toggle failed: ' + err.message);
    } finally {
      setToggling(false);
    }
  };

  const handleSyncKnowledge = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await api.syncGoogleDocsNow(docIdInput);
      alert(res.message);
      await loadData();
    } catch (err) {
      alert('Sync failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveClinic = async (e) => {
    e.preventDefault();
    try {
      await api.updateClinic(clinicInfo);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await loadData();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const isEnabled = googleDocsStatus?.enabled;

  return (
    <div className="space-y-5 page-enter">

      {/* ── Page Header ── */}
      <div className="glass-card rounded-2xl p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="font-bold text-base text-white">Derma Settings & Integrations</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Google Docs sync, Meta WhatsApp credentials, clinic config & DPDP audit trail</p>
        </div>
      </div>

      {/* ── Google Docs Integration ── */}
      <SectionCard
        title="Google Docs & Sheets Integration"
        subtitle="Sync clinic knowledge from Google Docs & stream live leads to Google Sheets"
        icon={FileSpreadsheet}
        iconColor="text-blue-400"
        iconBg="bg-blue-500/15"
      >
        {/* Status + Toggle row */}
        <div className="flex items-center justify-between mb-5 p-3 rounded-xl border border-white/5 bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}
            />
            <div>
              <p className="text-xs font-bold text-slate-200">{isEnabled ? 'Integration Active' : 'Integration Disabled'}</p>
              <p className="text-[10px] text-slate-500">
                {googleDocsStatus?.extracted_faqs_count || 0} FAQs synced ·{' '}
                Last sync:{' '}
                {googleDocsStatus?.last_synced_at
                  ? new Date(googleDocsStatus.last_synced_at).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleGoogleDocs}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-2 transition-all ${
              isEnabled
                ? 'btn-glow bg-emerald-500 text-black'
                : 'bg-dark-750 text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            {isEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Google Doc Knowledge Base ID"
            hint={<>Configured via <code className="bg-dark-850 px-1 py-0.5 rounded text-emerald-400 text-[9px] mono">ENABLE_GOOGLE_DOCS_SYNC</code> in .env</>}
          >
            <input
              type="text"
              value={docIdInput}
              onChange={e => setDocIdInput(e.target.value)}
              placeholder="1_sample_google_doc_id_for_clinic_knowledge_base"
              className={inputCls + ' font-mono'}
            />
          </FormField>

          <FormField
            label="Connected Google Sheet ID"
            hint="Exports leads & appointments in real-time"
          >
            <input
              type="text"
              readOnly
              value={googleDocsStatus?.sheet_id || 'sheet_derma_live_leads'}
              className={inputCls + ' font-mono opacity-60 cursor-default'}
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSyncKnowledge}
            disabled={!isEnabled || syncing}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all"
            style={{ boxShadow: '0 0 14px rgba(59,130,246,0.25)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronising…' : 'Sync Knowledge Base Now'}
          </button>
        </div>
      </SectionCard>

      {/* ── Clinic Details ── */}
      <SectionCard
        title="Clinic Contact & Physical Details"
        subtitle="WhatsApp bot uses these details to respond to location & contact queries"
        icon={Building}
      >
        <form onSubmit={handleSaveClinic} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Clinic Name">
              <input type="text" required value={clinicInfo.name || ''} onChange={e => setClinicInfo({ ...clinicInfo, name: e.target.value })} className={inputCls} />
            </FormField>
            <FormField label="Official WhatsApp Number">
              <input type="text" required value={clinicInfo.phone || ''} onChange={e => setClinicInfo({ ...clinicInfo, phone: e.target.value })} className={inputCls + ' font-mono text-emerald-400'} />
            </FormField>
          </div>

          <FormField label="Clinic Address & Landmarks">
            <input type="text" value={clinicInfo.address || ''} onChange={e => setClinicInfo({ ...clinicInfo, address: e.target.value })} className={inputCls} />
          </FormField>

          <FormField label="Working Hours">
            <input type="text" value={clinicInfo.working_hours || ''} onChange={e => setClinicInfo({ ...clinicInfo, working_hours: e.target.value })} placeholder="e.g. Mon–Sat: 10am–7pm" className={inputCls} />
          </FormField>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="btn-glow px-5 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-[11px] flex items-center gap-2"
            >
              {saved ? (
                <><CheckCircle2 className="w-3.5 h-3.5" />Saved!</>
              ) : (
                'Update Clinic Details'
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* ── Audit Log ── */}
      <SectionCard
        title="Security Audit Trail"
        subtitle="Immutable DPDP Act compliance logs — staff takeovers, bookings, config changes"
        icon={Shield}
      >
        <div
          className="rounded-xl overflow-hidden border border-white/5"
          style={{ background: 'rgba(0,0,0,0.3)', maxHeight: '16rem', overflowY: 'auto' }}
        >
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Timestamp','Action','User','Entity'].map(h => (
                  <th key={h} className="p-2.5 text-[9px] font-extrabold text-slate-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr
                  key={log.id}
                  className="hover:bg-white/2 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td className="p-2.5 text-[10px] text-slate-500 font-mono whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-2.5 text-[10px] text-emerald-400 font-bold">{log.action}</td>
                  <td className="p-2.5 text-[10px] text-slate-300">{log.user_id}</td>
                  <td className="p-2.5 text-[10px] text-slate-500">{log.entity}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-xs text-slate-600">No audit logs yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default Settings;

