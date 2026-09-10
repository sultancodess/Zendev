'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Building2,
  Clock,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Clinic, AuditLog } from '@dermo/types';

export default function SettingsPage() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [clinicName, setClinicName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [depositAmount, setDepositAmount] = useState(500);

  // Safety switches
  const [blockPrescriptions, setBlockPrescriptions] = useState(true);
  const [escalateEmergency, setEscalateEmergency] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [cData, logs] = await Promise.all([api.getClinic(), api.getAuditLogs()]);
      setClinic(cData);
      setAuditLogs(logs);
      if (cData) {
        setClinicName(cData.name);
        setPhone(cData.phone);
        setAddress(cData.address);
        setDepositAmount(cData.consultationDepositAmount || 500);
      }
    } catch (err) {
      console.error('Failed to load clinic settings:', err);
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateClinic({
        name: clinicName,
        phone,
        address,
        consultationDepositAmount: Number(depositAmount),
      });
      setSavedSuccess(true);
      await loadData();
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Clinic Configuration & Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage clinic working hours, medical safety guardrails, and compliance logs.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Clinic Settings & Safety */}
        <div className="lg:col-span-7 space-y-6">
          {/* Clinic Details Form */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Clinic Profile & Deposit Settings</span>
            </h3>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Clinic settings updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Official WhatsApp Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Default Deposit (₹)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Address & Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Medical Safety Guardrails Switches */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Medical Safety & Guardrail Policies</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">Strict Non-Diagnostic & Medication Filter</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Blocks prescriptions for tretinoin, accutane, antibiotics, and steroids.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={blockPrescriptions}
                  onChange={(e) => setBlockPrescriptions(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">Emergency Keyword Interceptor</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Instantly flags acute reactions and pauses AI for urgent staff intervention.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={escalateEmergency}
                  onChange={(e) => setEscalateEmergency(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Audit Trail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">DPDP Act Security Audit Trail</h3>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <div key={log.id} className="pt-2 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 font-mono text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Entity: <strong className="text-white">{log.entityType}</strong> ({log.entityId.substring(0, 12)}...)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
