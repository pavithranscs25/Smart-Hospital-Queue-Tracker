import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Activity, User, Stethoscope, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('patient');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, selectedRole);

    if (selectedRole === 'patient') onNavigate('/patient/dashboard');
    if (selectedRole === 'doctor') onNavigate('/doctor/dashboard');
    if (selectedRole === 'admin') onNavigate('/admin/dashboard');
  };

  const handleQuickDemoLogin = async (role) => {
    await login(undefined, undefined, role);
    if (role === 'patient') onNavigate('/patient/dashboard');
    if (role === 'doctor') onNavigate('/doctor/dashboard');
    if (role === 'admin') onNavigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Hospital Portal Login</h2>
          <p className="text-xs text-slate-500">Sign in to manage OPD tokens, doctor queues, and analytics.</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedRole('patient')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
              selectedRole === 'patient' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Patient
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('doctor')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
              selectedRole === 'doctor' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Doctor
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
              selectedRole === 'admin' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'patient' ? 'patient@example.com' : selectedRole === 'doctor' ? 'doctor@example.com' : 'admin@example.com'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            Log In as {selectedRole.toUpperCase()} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase text-slate-400">1-Click Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('patient')}
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition"
            >
              Demo Patient
            </button>
            <button
              onClick={() => handleQuickDemoLogin('doctor')}
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition"
            >
              Demo Doctor
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
