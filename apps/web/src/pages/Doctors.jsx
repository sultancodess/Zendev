import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit2, Trash2, Clock, Calendar, ShieldCheck, X } from 'lucide-react';
import { api } from '../services/api.js';

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    registration_no: '',
    specialty: '',
    consultation_duration: 30,
    fee: 800,
    working_start_time: '10:00',
    working_end_time: '19:00',
    break_start_time: '13:30',
    break_end_time: '14:30',
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });

  const loadDoctors = async () => {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors', err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleOpenModal = (doc = null) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        name: doc.name,
        qualification: doc.qualification || '',
        registration_no: doc.registration_no || '',
        specialty: doc.specialty || '',
        consultation_duration: doc.consultation_duration || 30,
        fee: doc.fee || 800,
        working_start_time: doc.working_start_time || '10:00',
        working_end_time: doc.working_end_time || '19:00',
        break_start_time: doc.break_start_time || '13:30',
        break_end_time: doc.break_end_time || '14:30',
        available_days: doc.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      });
    } else {
      setEditingDoc(null);
      setFormData({
        name: '',
        qualification: 'MBBS, MD (Dermatology)',
        registration_no: '',
        specialty: 'Clinical Dermatology',
        consultation_duration: 30,
        fee: 800,
        working_start_time: '10:00',
        working_end_time: '19:00',
        break_start_time: '13:30',
        break_end_time: '14:30',
        available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoc) {
        await api.updateDoctor(editingDoc.id, formData);
      } else {
        await api.createDoctor(formData);
      }
      setShowModal(false);
      await loadDoctors();
    } catch (err) {
      alert('Failed to save doctor: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await api.deleteDoctor(id);
      await loadDoctors();
    } catch (err) {
      alert('Failed to delete doctor: ' + err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#0A0F18] p-5 rounded-2xl border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Doctors & Clinical Schedules</h3>
            <p className="text-xs text-slate-400">Working hours, consultation durations, and appointment availability</p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#0A0F18] rounded-2xl p-5 border border-zinc-800/90 shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-white">{doc.name}</h4>
                  <p className="text-xs font-semibold text-emerald-400">{doc.specialty}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Specialist
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <p>🎓 <strong className="text-white">Qualifications:</strong> {doc.qualification}</p>
                {doc.registration_no && (
                  <p>📜 <strong className="text-white">Medical Council Reg:</strong> {doc.registration_no}</p>
                )}
                <p>💰 <strong className="text-white">Consultation Fee:</strong> <span className="text-emerald-400 font-bold">₹{doc.fee || 800}</span></p>
              </div>

              <div className="mt-3 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Timings: {doc.working_start_time} - {doc.working_end_time} (Break: {doc.break_start_time} - {doc.break_end_time})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Days: {doc.available_days?.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Slot Duration: {doc.consultation_duration} mins</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(doc)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0F18] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h4 className="font-bold text-base text-white">
                {editingDoc ? 'Edit Doctor Profile' : 'Add New Doctor'}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Ananya Sharma"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialty</label>
                <input
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Clinical Dermatology & Aesthetics"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="MBBS, MD (Dermatology)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Shift Start</label>
                  <input
                    type="time"
                    value={formData.working_start_time}
                    onChange={(e) => setFormData({ ...formData, working_start_time: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Shift End</label>
                  <input
                    type="time"
                    value={formData.working_end_time}
                    onChange={(e) => setFormData({ ...formData, working_end_time: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Break Start</label>
                  <input
                    type="time"
                    value={formData.break_start_time}
                    onChange={(e) => setFormData({ ...formData, break_start_time: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Break End</label>
                  <input
                    type="time"
                    value={formData.break_end_time}
                    onChange={(e) => setFormData({ ...formData, break_end_time: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
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
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
