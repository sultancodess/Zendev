import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { api } from '../services/api.js';

export function Services() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Clinical Dermatology',
    price: 800,
    duration: 30,
    description: '',
    is_active: true,
    booking_enabled: true
  });

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category || 'Clinical Dermatology',
        price: service.price,
        duration: service.duration,
        description: service.description || '',
        is_active: service.is_active !== false,
        booking_enabled: service.booking_enabled !== false
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        category: 'Clinical Dermatology',
        price: 800,
        duration: 30,
        description: '',
        is_active: true,
        booking_enabled: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.updateService(editingService.id, formData);
      } else {
        await api.createService(formData);
      }
      setShowModal(false);
      await loadServices();
    } catch (err) {
      alert('Failed to save service: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      await loadServices();
    } catch (err) {
      alert('Failed to delete service: ' + err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#0A0F18] p-5 rounded-2xl border border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Treatments & Pricing Catalog</h3>
            <p className="text-xs text-slate-400">EvilChat AI reads current prices & durations directly from this database</p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Treatment</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-[#0A0F18] rounded-2xl p-5 border border-zinc-800/90 shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {s.category || 'General'}
                </span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  ₹{Number(s.price).toLocaleString()}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white mb-1">{s.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {s.description || 'Customized clinical treatment tailored to patient skin assessment.'}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{s.duration} mins slot</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(s)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0F18] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h4 className="font-bold text-base text-white">
                {editingService ? 'Edit Treatment' : 'Add New Treatment'}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Treatment Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PRP Hair Loss Therapy"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (for EvilChat AI Bot)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain benefits, indications, and protocol..."
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
