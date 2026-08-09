import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Activity,
  Ticket,
  Clock,
  History,
  User,
  Stethoscope,
  LayoutDashboard,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export const Navbar = ({ currentPath, onNavigate }) => {
  const { user, logout, activeToken } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPatient = !user || user.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  const handleNav = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-teal-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                ApexCare
              </span>
              <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-widest block">
                Smart Hospital Queue
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition ${
                currentPath === '/' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Patient Links */}
            {isPatient && (
              <>
                <button
                  onClick={() => handleNav('/patient/dashboard')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    currentPath === '/patient/dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </button>

                <button
                  onClick={() => handleNav('/patient/get-token')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    currentPath === '/patient/get-token' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-teal-600" /> Get Token
                </button>

                <button
                  onClick={() => handleNav('/patient/track')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    currentPath === '/patient/track' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> Track Queue
                  {activeToken && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => handleNav('/patient/history')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    currentPath === '/patient/history' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <History className="w-3.5 h-3.5" /> History
                </button>
              </>
            )}

            {/* Doctor Links */}
            {isDoctor && (
              <>
                <button
                  onClick={() => handleNav('/doctor/dashboard')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    currentPath === '/doctor/dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Doctor Console
                </button>

                <button
                  onClick={() => handleNav('/doctor/queue')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    currentPath === '/doctor/queue' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" /> Full Queue
                </button>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <button
                onClick={() => handleNav('/admin/dashboard')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  currentPath === '/admin/dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-purple-600" /> Admin Analytics
              </button>
            )}
          </div>

          {/* User Profile Button */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav('/patient/profile')}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-teal-300 transition bg-slate-50"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-teal-600 font-medium capitalize">{user.role}</p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Login / Access
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </button>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase text-slate-400 mb-1">Patient Portal</p>
            <button
              onClick={() => handleNav('/patient/dashboard')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" /> Patient Dashboard
            </button>
            <button
              onClick={() => handleNav('/patient/get-token')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-teal-600" /> Get Token
            </button>
            <button
              onClick={() => handleNav('/patient/track')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-emerald-600" /> Track Live Queue
            </button>
            <button
              onClick={() => handleNav('/patient/history')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <History className="w-4 h-4 text-slate-600" /> Queue History
            </button>
            <button
              onClick={() => handleNav('/patient/profile')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <User className="w-4 h-4 text-slate-600" /> Profile
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase text-slate-400 mb-1">Clinical Console</p>
            <button
              onClick={() => handleNav('/doctor/dashboard')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-600" /> Doctor Dashboard
            </button>
            <button
              onClick={() => handleNav('/doctor/queue')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-teal-600" /> Doctor Queue View
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase text-slate-400 mb-1">Admin Portal</p>
            <button
              onClick={() => handleNav('/admin/dashboard')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-600" /> Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
