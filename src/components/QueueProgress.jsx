import React from 'react';
import { Ticket, Clock, Bell, Stethoscope, CheckCircle2 } from 'lucide-react';

export const QueueProgress = ({ status }) => {
  const norm = (status || '').toLowerCase();

  let activeStep = 1; // 1: Token Issued, 2: Waiting, 3: Called, 4: In Consultation, 5: Completed
  if (norm === 'waiting') activeStep = 2;
  if (norm === 'on_hold') activeStep = 2;
  if (norm === 'serving') activeStep = 4;
  if (norm === 'completed') activeStep = 5;

  const steps = [
    { step: 1, label: 'Token Issued', icon: Ticket, desc: 'Registered in queue' },
    { step: 2, label: 'Waiting in Queue', icon: Clock, desc: 'Position calculated' },
    { step: 3, label: 'Called by Doctor', icon: Bell, desc: 'Proceed to room' },
    { step: 4, label: 'In Consultation', icon: Stethoscope, desc: 'Doctor checking patient' },
    { step: 5, label: 'Completed', icon: CheckCircle2, desc: 'Finished consultation' }
  ];

  return (
    <div className="w-full py-6 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
        Live Patient Journey Status
      </h4>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative max-w-3xl mx-auto px-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0" />

        {/* Progress Line */}
        <div
          className="absolute top-1/2 left-8 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${Math.max(0, (activeStep - 1) * 23)}%` }}
        />

        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = s.step < activeStep;
          const isCurrent = s.step === activeStep;

          return (
            <div key={s.step} className="relative z-10 flex flex-col items-center text-center group">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 font-bold ${
                  isCurrent
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md scale-110'
                    : isDone
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-teal-900' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                {s.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{s.desc}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4 px-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = s.step < activeStep;
          const isCurrent = s.step === activeStep;

          return (
            <div key={s.step} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold ${
                  isCurrent
                    ? 'bg-teal-600 text-white ring-2 ring-teal-200'
                    : isDone
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-400">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
