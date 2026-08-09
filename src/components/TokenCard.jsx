import React from 'react';
import { StatusBadge } from './StatusBadge.jsx';
import { Clock, User, Building2, MapPin, Ticket, ShieldCheck, Printer } from 'lucide-react';

export const TokenCard = ({ details, onPrint }) => {
  const isServing = details.status === 'serving';

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-xl shadow-teal-900/5 overflow-hidden transition-all duration-300">
      {/* Header Banner */}
      <div className={`px-6 py-5 text-white flex items-center justify-between ${
        isServing
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
          : 'bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
            <Ticket className="w-6 h-6 text-teal-100" />
          </div>
          <div>
            <p className="text-xs font-medium text-teal-100 uppercase tracking-wider">Queue Token Ticket</p>
            <h3 className="text-lg font-bold">Apex Medicare Hospital</h3>
          </div>
        </div>
        <StatusBadge status={details.status} size="lg" />
      </div>

      {/* Main Token Visual */}
      <div className="p-6 md:p-8">
        <div className="text-center pb-6 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Your Token Number</p>
          <div className="inline-block px-8 py-3 bg-teal-50/80 rounded-2xl border border-teal-200/60 my-2">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-teal-900 font-mono">
              {details.token}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Token issued & registered in hospital queue
          </p>
        </div>

        {/* Live Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100 bg-slate-50/50 rounded-xl px-4 my-6">
          <div className="text-center">
            <span className="text-xs font-medium text-slate-400 block mb-0.5">Now Serving</span>
            <span className="text-xl font-bold text-slate-800 font-mono">
              {details.nowServing || '---'}
            </span>
          </div>

          <div className="text-center">
            <span className="text-xs font-medium text-slate-400 block mb-0.5">Queue Position</span>
            <span className="text-xl font-bold text-teal-700">
              {typeof details.position === 'number' ? `#${details.position}` : details.position}
            </span>
          </div>

          <div className="text-center">
            <span className="text-xs font-medium text-slate-400 block mb-0.5">Patients Ahead</span>
            <span className="text-xl font-bold text-amber-600">
              {details.patientsAhead ?? 0}
            </span>
          </div>

          <div className="text-center">
            <span className="text-xs font-medium text-slate-400 block mb-0.5">Est. Waiting Time</span>
            <span className="text-xl font-bold text-emerald-600 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 inline" />
              {details.estimatedWaitMinutes} <span className="text-xs font-normal text-slate-500">mins</span>
            </span>
          </div>
        </div>

        {/* Doctor & Department Details */}
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
            <span className="flex items-center gap-2 text-slate-500">
              <Building2 className="w-4 h-4 text-teal-600" /> Department
            </span>
            <span className="font-semibold text-slate-800">{details.departmentName}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
            <span className="flex items-center gap-2 text-slate-500">
              <User className="w-4 h-4 text-teal-600" /> Doctor
            </span>
            <span className="font-semibold text-slate-800">{details.doctorName}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
            <span className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-4 h-4 text-teal-600" /> Room Location
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              {details.roomNo}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-2 text-slate-500">
              <User className="w-4 h-4 text-teal-600" /> Patient Name
            </span>
            <span className="font-semibold text-slate-800">{details.patientName}</span>
          </div>
        </div>

        {/* Optional Action Bar */}
        {onPrint && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              <Printer className="w-4 h-4" /> Print Token Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
