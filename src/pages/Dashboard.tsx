import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { 
  Building2, Users, Activity, Plus, Trash2, 
  X, Loader2, Search, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  created_at: string;
  users_count: number;
}

export default function Dashboard() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({ clinic_name: '', owner_name: '', owner_email: '', owner_role: 'Doctor' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMsg, setFormMsg] = useState('');

  const fetchClinics = async () => {
    try {
      const res = await api.get('/v1/superadmin/clinics');
      setClinics(res.data.data);
    } catch (error) {
      console.error('Failed to fetch clinics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you absolutely sure? This is a HARD DELETE and will wipe the clinic and all its users permanently.')) return;
    
    try {
      await api.delete(`/v1/superadmin/clinics/${id}`);
      setClinics(clinics.filter(c => c.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete clinic');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      await api.post('/v1/superadmin/clinics', formData);
      setFormStatus('success');
      setFormMsg('Provisioned successfully! The Owner Password is: Temporary123!');
      setFormData({ clinic_name: '', owner_name: '', owner_email: '', owner_role: 'Doctor' });
      fetchClinics(); // Refresh list
      setTimeout(() => {
        setIsModalOpen(false);
        setFormStatus('idle');
      }, 5000);
    } catch (err: any) {
      setFormStatus('error');
      setFormMsg(err.response?.data?.error || 'Error creating clinic');
    }
  };

  const totalUsers = clinics.reduce((acc, curr) => acc + curr.users_count, 0);
  const filteredClinics = clinics.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;
  }

  return (
    <div className="p-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics Overview</h1>
          <p className="text-zinc-400">Monitor and manage all tenant clinics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <Plus className="w-5 h-5" />
          Provision Clinic
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Clinics</p>
              <h3 className="text-4xl font-bold text-white tracking-tight">{clinics.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Sub-Accounts</p>
              <h3 className="text-4xl font-bold text-white tracking-tight">{totalUsers}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">System Health</p>
              <h3 className="text-4xl font-bold text-white tracking-tight">Optimal</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Active Deployments</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search clinics..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800/50 text-sm font-medium text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4">Clinic ID</th>
                <th className="px-6 py-4">Clinic Name</th>
                <th className="px-6 py-4">Users</th>
                <th className="px-6 py-4">Created On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-500 font-mono">...{clinic.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-200">{clinic.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                      {clinic.users_count} accounts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {new Date(clinic.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(clinic.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      title="Hard Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClinics.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No clinics found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Creation Slide-over Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[101] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">Provision New Clinic</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Clinic Name</label>
                    <input required type="text" value={formData.clinic_name} onChange={e => setFormData({...formData, clinic_name: e.target.value})} placeholder="Apollo Hospitals" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Owner Name</label>
                    <input required type="text" value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} placeholder="Dr. Sarah Jenkins" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Owner Email</label>
                    <input required type="email" value={formData.owner_email} onChange={e => setFormData({...formData, owner_email: e.target.value})} placeholder="sarah@apollo.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Owner Role</label>
                    <select value={formData.owner_role} onChange={e => setFormData({...formData, owner_role: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Doctor">Doctor</option>
                      <option value="CRO">CRO</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Nurse">Nurse</option>
                    </select>
                  </div>

                  {formStatus === 'error' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                      <AlertCircle className="w-5 h-5" /><p className="text-sm">{formMsg}</p>
                    </div>
                  )}
                  {formStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" /><p className="text-sm">{formMsg}</p>
                    </div>
                  )}

                  <button type="submit" disabled={formStatus === 'loading'} className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 mt-8">
                    {formStatus === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create & Provision Admin'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
