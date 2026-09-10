'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RazorpayOrder, Lead } from '@dermo/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<RazorpayOrder[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Form State
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [amount, setAmount] = useState(500);
  const [description, setDescription] = useState('Consultation Holding Deposit');
  const [createdOrder, setCreatedOrder] = useState<RazorpayOrder | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [payData, leadData] = await Promise.all([api.getPayments(), api.getLeads()]);
      setPayments(payData);
      setLeads(leadData);
      if (leadData.length > 0) setSelectedLeadId(leadData[0].id);
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !amount) return;

    try {
      const order = await api.createPaymentOrder({
        leadId: selectedLeadId,
        amount: Number(amount),
        description,
      });
      setCreatedOrder(order);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalCaptured = payments
    .filter((p) => p.status === 'CAPTURED')
    .reduce((sum, p) => sum + p.amount / 100, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Razorpay Payment Gateway & Deposits</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated advance consultation holding deposits and treatment payment verification.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedOrder(null);
            setShowOrderModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Razorpay Link</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Captured Revenue</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {formatCurrency(totalCaptured)}
          </div>
          <div className="text-[10px] text-slate-500">Collected through Razorpay UPI & Cards</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Orders Generated</span>
          <div className="text-2xl font-bold font-mono text-white">{payments.length}</div>
          <div className="text-[10px] text-slate-500">Includes WhatsApp holding links</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Razorpay Gateway Status</span>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HMAC Verification Active</span>
          </div>
          <div className="text-[10px] text-slate-500">Instant webhook reconciliation</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Payment Orders & Audit Trail</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Order ID & Receipt</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/30">
                  <td className="p-3.5">
                    <div className="font-mono text-white font-semibold">{pay.orderId}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{pay.receipt}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-200">{pay.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pay.customerPhone}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">
                    {formatCurrency(pay.amount / 100, pay.currency)}
                  </td>
                  <td className="p-3.5 text-slate-300 text-xs">{pay.description}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        pay.status === 'CAPTURED'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                    {formatDate(pay.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-700 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Generate Razorpay Payment Order</h3>

            {createdOrder ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Order Created Successfully</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Order ID: <strong className="font-mono text-white">{createdOrder.orderId}</strong>
                  </div>
                  <div className="text-xs text-slate-300">
                    Amount: <strong className="font-mono text-emerald-400">₹{createdOrder.amount / 100}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Select Patient *</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Deposit Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payment Purpose</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                  >
                    Create Razorpay Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
