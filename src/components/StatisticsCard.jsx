import React from 'react';

export const StatisticsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'teal'
}) => {
  const colorMap = {
    teal: 'bg-teal-50/80 text-teal-700 border-teal-200/60',
    emerald: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    cyan: 'bg-cyan-50/80 text-cyan-700 border-cyan-200/60',
    purple: 'bg-purple-50/80 text-purple-700 border-purple-200/60',
    slate: 'bg-slate-50/80 text-slate-700 border-slate-200/60'
  };

  const iconBgMap = {
    teal: 'bg-teal-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
    cyan: 'bg-cyan-600 text-white',
    purple: 'bg-purple-600 text-white',
    slate: 'bg-slate-700 text-white'
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} shadow-xs transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 font-mono">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/80 border border-slate-200 text-slate-700">
              {trend}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgMap[color]} shadow-sm shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
