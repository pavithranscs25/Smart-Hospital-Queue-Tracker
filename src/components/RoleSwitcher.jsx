import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Stethoscope, ShieldCheck, RefreshCw } from 'lucide-react';

export const RoleSwitcher = () => {
  const { user, switchRole, isLoading } = useAuth();

  return (
    <div className="bg-slate-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">Smart Hospital Role Switcher:</span>
        <span className="text-slate-400 hidden sm:inline">Current Account:</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-medium">
          {user ? `${user.name} (${user.role.toUpperCase()})` : 'Not Logged In'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => switchRole('patient')}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
            user?.role === 'patient'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <User className="w-3 h-3" /> Patient View
        </button>

        <button
          onClick={() => switchRole('doctor')}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
            user?.role === 'doctor'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Stethoscope className="w-3 h-3" /> Doctor View
        </button>

        <button
          onClick={() => switchRole('admin')}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
            user?.role === 'admin'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-3 h-3" /> Admin View
        </button>

        {isLoading && <RefreshCw className="w-3 h-3 animate-spin text-teal-400" />}
      </div>
    </div>
  );
};
