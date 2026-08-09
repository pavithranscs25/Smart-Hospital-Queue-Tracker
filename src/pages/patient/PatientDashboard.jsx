import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { queueApi } from '../../services/api.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { TokenCard } from '../../components/TokenCard.jsx';
import {
  Clock,
  Ticket,
  RefreshCw,
  PlusCircle,
  History,
  ArrowRight
} from 'lucide-react';

export const PatientDashboard = ({ onNavigate }) => {
  const { user, activeToken } = useAuth();
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveTokenData = async () => {
    if (!activeToken) {
      setTokenDetails(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await queueApi.getTokenDetails(activeToken);
      setTokenDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTokenData();
    const interval = setInterval(fetchActiveTokenData, 3500);
    return () => clearInterval(interval);
  }, [activeToken]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Patient OPD Portal</span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">Welcome back, {user?.name || 'Patient'}!</h1>
          <p className="text-xs md:text-sm text-teal-100 mt-1 max-w-xl">
            Monitor your live hospital token status, estimated wait times, and consultation schedule.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('/patient/get-token')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Get New Token
          </button>
          <button
            onClick={() => onNavigate('/patient/track')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-emerald-400" /> Track Live Queue
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {tokenDetails ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Token Details Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-teal-600" /> Active Queue Token
              </h2>
              <button
                onClick={fetchActiveTokenData}
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Auto-syncing
              </button>
            </div>

            <TokenCard details={tokenDetails} onPrint={() => window.print()} />
          </div>

          {/* Quick Metrics Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Queue Summary</h3>

              <div className="space-y-3 divide-y divide-slate-100 text-sm">
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Token ID</span>
                  <span className="font-mono font-bold text-teal-800">{tokenDetails.token}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Current Status</span>
                  <StatusBadge status={tokenDetails.status} />
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Now Serving Token</span>
                  <span className="font-mono font-bold text-slate-800">{tokenDetails.nowServing}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Your Position</span>
                  <span className="font-bold text-teal-700">
                    {typeof tokenDetails.position === 'number' ? `#${tokenDetails.position}` : tokenDetails.position}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Patients Ahead</span>
                  <span className="font-bold text-amber-600">{tokenDetails.patientsAhead}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Est. Waiting Time</span>
                  <span className="font-bold text-emerald-600">{tokenDetails.estimatedWaitMinutes} mins</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-semibold text-slate-800">{tokenDetails.doctorName}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold text-slate-800">{tokenDetails.departmentName}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => onNavigate('/patient/track')}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Live Visual Tracker <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Active Token State */
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No Active Queue Token</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
            You currently do not have an active queue token. Generate a new token for OPD consultations or track a specific token number.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate('/patient/get-token')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Get Queue Token
            </button>
            <button
              onClick={() => onNavigate('/patient/history')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <History className="w-4 h-4" /> View Token History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
