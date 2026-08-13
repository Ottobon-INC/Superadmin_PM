import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Building2, LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isClinicDetail = location.pathname.startsWith('/clinic/');

  const handleLogout = () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-zinc-100 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-64 border-r border-zinc-800/50 bg-zinc-950/30 backdrop-blur-xl flex flex-col fixed inset-y-0 left-0 z-50"
      >
        <div className="h-20 flex items-center px-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-bold text-lg tracking-tight">OmniCommand</span>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === '/' 
                ? 'bg-zinc-800/50 text-white border border-zinc-700/50 shadow-inner' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>

          {isClinicDetail && (
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back to Overview</span>
            </button>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 relative min-h-screen">
        {/* Top Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
