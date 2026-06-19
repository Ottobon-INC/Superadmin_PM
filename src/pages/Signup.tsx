import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { Building2, Lock, Mail, Loader2, AlertCircle, User, KeyRound } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', secret_code: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await api.post('/v1/superadmin/auth/signup', formData);
      
      const { user, token } = response.data.data;
      localStorage.setItem('superadmin_token', token);
      localStorage.setItem('superadmin_user', JSON.stringify(user));
      navigate('/');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl mb-6 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Building2 className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">OmniCommand</h1>
          <p className="text-zinc-500">Super Admin Provisioning</p>
        </div>

        <form onSubmit={handleSignup} className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-zinc-600" /></div>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Sarah Jenkins" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-zinc-600" /></div>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@omnicommand.com" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-zinc-600" /></div>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-400 mb-2">Secret Invite Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><KeyRound className="h-5 w-5 text-indigo-600" /></div>
                <input required type="password" name="secret_code" value={formData.secret_code} onChange={handleChange} placeholder="Enter your invite code" className="w-full bg-indigo-950/10 border border-indigo-500/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
              </div>
            </div>
          </div>

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" /><p className="text-sm">{message}</p>
            </motion.div>
          )}

          <button type="submit" disabled={status === 'loading'} className="mt-8 w-full flex items-center justify-center gap-2 bg-indigo-500 text-white hover:bg-indigo-400 font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
            {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Provisioning'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
