import React, { useEffect, useState } from 'react';
import { queueApi } from '../services/api.js';
import {
  Ticket,
  Clock,
  Activity,
  Users,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
  const [currentQueueSummary, setCurrentQueueSummary] = useState(null);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const data = await queueApi.getCurrentQueue();
        setCurrentQueueSummary(data);
      } catch (err) {
        console.error('Failed to fetch current queue summary:', err);
      }
    };
    fetchCurrent();
    const interval = setInterval(fetchCurrent, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-teal-300" /> Smart Outpatient Queue System
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                Zero Waiting Room Crowds.{' '}
                <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Live Smart Queue.
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Get your OPD queue token digitally from anywhere. Track live queue positions, estimated waiting times, and step into the doctor's room right when called.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/patient/get-token')}
                  className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 transition hover:scale-105"
                >
                  <Ticket className="w-5 h-5" /> Get Queue Token
                </button>

                <button
                  onClick={() => onNavigate('/patient/track')}
                  className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-teal-300 font-bold text-sm rounded-xl border border-teal-500/30 flex items-center gap-2 transition backdrop-blur-md hover:scale-105"
                >
                  <Clock className="w-5 h-5 text-emerald-400" /> Track Live Queue
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-700/60 flex flex-wrap gap-6 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Registration Required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Doctor Updates
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant SMS / Ticket Preview
                </span>
              </div>
            </div>

            {/* Right Column Live Banner Box */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-white">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span className="font-bold text-sm">Hospital Live Queue Display</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
                    Live Syncing
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-2xl font-black text-teal-300 font-mono">
                        {currentQueueSummary?.waitingCount ?? 5}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Patients Waiting</p>
                    </div>

                    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-2xl font-black text-emerald-300 font-mono">
                        {currentQueueSummary?.currentlyServingCount ?? 2}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Now Serving</p>
                    </div>
                  </div>

                  {/* Serving Tokens preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Currently In Consultation Rooms:
                    </p>
                    {currentQueueSummary?.servingTokens?.length > 0 ? (
                      currentQueueSummary.servingTokens.slice(0, 3).map((st) => (
                        <div
                          key={st.token}
                          className="p-2.5 bg-slate-900/80 rounded-xl border border-teal-500/30 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-emerald-400 font-mono mr-2">{st.token}</span>
                            <span className="text-xs font-medium text-slate-200">{st.patientName}</span>
                          </div>
                          <span className="text-[10px] bg-teal-900/80 text-teal-200 px-2 py-0.5 rounded">
                            {st.room}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-slate-900/50 rounded-xl text-center text-xs text-slate-400">
                        GEN-019 • Room 102 (Dr. Rajesh Kumar)
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('/patient/track')}
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    View All Active OPD Queues <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-bold text-slate-900">How CareQueue Works</h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed for effortless patient experience without waiting in long physical queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group hover:border-teal-300 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center mb-4 text-base">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Select Department</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose Cardiology, General Medicine, Pediatrics, or Orthopedics and pick your preferred doctor.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group hover:border-teal-300 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center mb-4 text-base">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Get Digital Token</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate your OPD token instantly. Receive estimated wait times based on live doctor progress.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group hover:border-teal-300 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center mb-4 text-base">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Track Live Status</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Relax in the cafeteria or courtyard. Monitor live queue positions updated dynamically.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group hover:border-teal-300 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center mb-4 text-base">
                4
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Step In When Called</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When your token is called by the doctor, proceed directly to your assigned room number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 block mb-2">
              Integrated Hospital Solution
            </span>
            <h2 className="text-3xl font-bold text-slate-900">Key Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Waiting Time Algorithm</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculates estimated wait time dynamically using actual doctor consultation speed and patients ahead.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Doctor Console Controls</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Doctors can Call Next Patient, Complete Consultation, Put on Hold, or Skip absent patients in 1 click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Admin Analytics Dashboard</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comprehensive OPD metrics, queue bottlenecks analysis, active doctors count, and department breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
