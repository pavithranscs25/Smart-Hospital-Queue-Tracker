import React from 'react';
import { Activity, Phone, Mail, MapPin, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ApexCare Hospital</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Next-generation Smart Hospital Queue Management System minimizing waiting times, optimizing patient flow, and empowering healthcare providers.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Backend Queue Active
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Patient Portal</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#/patient/get-token" className="hover:text-teal-400 transition">Get Queue Token</a></li>
            <li><a href="#/patient/track" className="hover:text-teal-400 transition">Track Live Status</a></li>
            <li><a href="#/patient/dashboard" className="hover:text-teal-400 transition">Patient Dashboard</a></li>
            <li><a href="#/patient/history" className="hover:text-teal-400 transition">Token History</a></li>
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Outpatient Departments</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>General Medicine (1st Floor)</li>
            <li>Cardiology & ECG (2nd Floor)</li>
            <li>Orthopedics & Trauma (3rd Floor)</li>
            <li>Pediatrics & Vaccination (1st Floor)</li>
            <li>Neurology & Dermatology</li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Emergency & Hours</h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>24/7 Helpline: <strong>+1 (800) 555-APEX</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>queue@apexmedicare.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>OPD Queue: Mon - Sat (8:00 AM - 8:00 PM)</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Main Campus, Healthcare Avenue</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ApexCare Hospital. Smart Queue Management System. All rights reserved.
      </div>
    </footer>
  );
};
