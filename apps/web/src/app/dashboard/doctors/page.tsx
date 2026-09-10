'use client';

import React, { useEffect, useState } from 'react';
import {
  Stethoscope,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Doctor } from '@dermo/types';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
      if (data.length > 0) setSelectedDoc(data[0]);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-emerald-400" />
          <span>Doctor Profiles & Shift Schedules</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage clinical specialists, consultation fees, and weekly slot availability rules.
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className={`glass-card rounded-2xl p-6 border transition-all cursor-pointer space-y-4 ${
              selectedDoc?.id === doc.id
                ? 'border-emerald-500/80 bg-slate-900/90 glow-emerald'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <img
                src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                alt={doc.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">{doc.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {doc.status}
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-medium">{doc.title}</div>
                <div className="text-[11px] text-slate-400">{doc.qualification}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {doc.bio}
            </p>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Specialties
              </span>
              <div className="flex flex-wrap gap-1.5">
                {doc.specialty.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-[10px] border border-slate-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Experience: <strong className="text-white">{doc.experienceYears}+ years</strong>
              </div>
              <div>
                Consultation Fee: <strong className="text-emerald-400 font-mono font-bold text-sm">₹{doc.consultationFee}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Doctor Shift Schedule Inspector */}
      {selectedDoc && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                Weekly Shift Schedule for {selectedDoc.name}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              30 Mins / Slot • Break: 1:00 PM – 2:00 PM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {selectedDoc.schedule.map((shift, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-center text-xs space-y-1 ${
                  shift.isWorking
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[11px] text-emerald-400">
                  {shift.day}
                </div>
                {shift.isWorking ? (
                  <>
                    <div className="font-mono text-[11px] text-white font-semibold">
                      {shift.startTime} – {shift.endTime}
                    </div>
                    {shift.breakStart && (
                      <div className="text-[10px] text-slate-500">
                        Break: {shift.breakStart}-{shift.breakEnd}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[11px] text-slate-500 py-1">Day Off</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
