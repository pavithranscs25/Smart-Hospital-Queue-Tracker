import React from 'react';
import { StatusBadge } from './StatusBadge.jsx';
import { User, Stethoscope, AlertCircle, CheckCircle, PauseCircle, FastForward } from 'lucide-react';

export const QueueCard = ({
  item,
  isCurrent = false,
  onCall,
  onComplete,
  onSkip,
  onHold,
  showActions = false
}) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${
        isCurrent
          ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-md'
          : item.status === 'serving'
          ? 'bg-teal-50/60 border-teal-200 shadow-sm'
          : item.status === 'on_hold'
          ? 'bg-purple-50/40 border-purple-200'
          : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Token & Patient */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base ${
              isCurrent || item.status === 'serving'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {item.token}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm md:text-base">{item.patientName}</h4>
              {item.priority === 'urgent' && (
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded">
                  Urgent
                </span>
              )}
              {item.priority === 'emergency' && (
                <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded animate-pulse">
                  Emergency
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{item.patientGender || 'Age ' + item.patientAge} • {item.patientAge} yrs</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-slate-400" /> {item.departmentName}
              </span>
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} size="sm" />
        </div>
      </div>

      {/* Symptoms / Reason */}
      {item.symptoms && (
        <div className="mt-2.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1"><strong className="font-medium text-slate-700">Reason:</strong> {item.symptoms}</span>
        </div>
      )}

      {/* Actions Bar for Doctor */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
          {item.status === 'waiting' && onCall && (
            <button
              onClick={() => onCall(item.token)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 transition"
            >
              <User className="w-3.5 h-3.5" /> Call Patient
            </button>
          )}

          {item.status === 'serving' && onComplete && (
            <button
              onClick={() => onComplete(item.token)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Complete
            </button>
          )}

          {(item.status === 'waiting' || item.status === 'serving') && onHold && (
            <button
              onClick={() => onHold(item.token)}
              className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-medium rounded-lg flex items-center gap-1 transition"
            >
              <PauseCircle className="w-3.5 h-3.5" /> Hold
            </button>
          )}

          {(item.status === 'waiting' || item.status === 'serving') && onSkip && (
            <button
              onClick={() => onSkip(item.token)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-medium rounded-lg flex items-center gap-1 transition"
            >
              <FastForward className="w-3.5 h-3.5" /> Skip
            </button>
          )}

          {item.status === 'on_hold' && onCall && (
            <button
              onClick={() => onCall(item.token)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 transition"
            >
              Resume Patient
            </button>
          )}
        </div>
      )}
    </div>
  );
};
