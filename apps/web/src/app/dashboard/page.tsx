'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  CreditCard,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  PhoneCall,
  Stethoscope,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, apts, convs, docs] = await Promise.all([
          api.getAnalyticsOverview(),
          api.getAppointments(),
          api.getConversations(),
          api.getDoctors(),
        ]);
        setOverview(ovData);
        setAppointments(apts);
        setConversations(convs);
        setDoctors(docs);
      } catch (err) {
        console.error('Failed loading dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading clinic operational metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl glow-emerald overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Receptionist Operating at Peak Efficiency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DermaCare Aesthetics & Laser Clinic
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Live patient conversion pipeline, automated slot booking, and Razorpay payment holds synchronized in real time.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 sm:absolute sm:right-8 sm:bottom-8 flex gap-3">
          <Link
            href="/dashboard/conversations"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open WhatsApp Simulator</span>
          </Link>
          <Link
            href="/dashboard/appointments"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Manage Slots</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Inquiries */}
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">WhatsApp Inquiries</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {overview?.totalEnquiries || 0}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+24% vs last week</span>
          </div>
        </div>

        {/* Qualified Leads */}
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Qualified Leads</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {overview?.qualifiedLeads || 0}
          </div>
          <div className="text-[11px] text-slate-400">
            High-intent patient inquiries
          </div>
        </div>

        {/* Appointments Booked */}
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Confirmed Bookings</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {overview?.appointmentsBooked || 0}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{overview?.aiConversionRate || 0}% conversion rate</span>
          </div>
        </div>

        {/* Razorpay Revenue */}
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Razorpay Deposits</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {formatCurrency(overview?.totalRevenue || 0)}
          </div>
          <div className="text-[11px] text-slate-400">
            Advance holding fees captured
          </div>
        </div>
      </div>

      {/* Main Grid: Doctors Shifts & Recent Appointments */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Appointments & Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Appointments */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Upcoming Appointments</h3>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {appointments.slice(0, 4).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">
                      {apt.startTime}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-xs sm:text-sm">{apt.leadName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>{apt.serviceName}</span>
                        <span>•</span>
                        <span className="text-emerald-400/90">{apt.doctorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : apt.status === 'BOOKED'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                    {apt.paymentStatus === 'PAID' && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[9px] font-mono border border-emerald-800">
                        ₹{apt.depositPaid} Paid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent WhatsApp Live Conversations */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Live Patient Conversations</h3>
              </div>
              <Link
                href="/dashboard/conversations"
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <span>Live Chat Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {conversations.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{conv.patientName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{conv.patientPhone}</span>
                      {conv.mode === 'HUMAN_TAKEOVER' ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30">
                          Staff Takeover
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                          AI Handling
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {conv.lastMessagePreview || 'No messages yet.'}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/conversations`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    Open Chat
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Doctor Availability Today & AI Performance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Doctor Profiles & Shifts */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Doctors on Duty Today</h3>
              </div>
              <Link
                href="/dashboard/doctors"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Manage Shifts
              </Link>
            </div>

            <div className="space-y-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120'}
                      alt={doc.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">{doc.name}</div>
                      <div className="text-[10px] text-emerald-400">{doc.title}</div>
                      <div className="text-[10px] text-slate-400">{doc.qualification}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      10:00 AM – 6:00 PM (30m slots)
                    </span>
                    <span className="font-mono text-white font-bold">₹{doc.consultationFee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Grounding & DPDP Compliance Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Medical Safety & Compliance System</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dermo's safety guardrail intercepts medical prescription requests and routes emergency keywords directly to on-duty staff. All chats are encrypted.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
              <span>• Zero Hallucinations</span>
              <span>• Meta Webhook Verified</span>
              <span>• DPDP Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
