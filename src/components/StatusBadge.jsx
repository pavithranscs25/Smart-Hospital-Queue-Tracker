import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;
  let pulse = false;

  switch (normStatus) {
    case 'waiting':
      styles = 'bg-amber-50 text-amber-700 border-amber-200/80';
      label = 'Waiting';
      break;
    case 'serving':
    case 'in room':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs font-semibold';
      label = 'In Consultation';
      pulse = true;
      break;
    case 'completed':
      styles = 'bg-sky-50 text-sky-700 border-sky-200';
      label = 'Completed';
      break;
    case 'on_hold':
    case 'hold':
      styles = 'bg-purple-50 text-purple-700 border-purple-200';
      label = 'On Hold';
      break;
    case 'skipped':
      styles = 'bg-rose-50 text-rose-700 border-rose-200';
      label = 'Skipped';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-md',
    md: 'px-2.5 py-1 text-xs font-medium rounded-full',
    lg: 'px-3.5 py-1.5 text-sm font-semibold rounded-full'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border ${styles} ${sizeClasses[size]}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {label}
    </span>
  );
};
