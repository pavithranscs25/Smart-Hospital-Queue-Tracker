import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { queueApi } from '../../services/api.js';
import { TokenCard } from '../../components/TokenCard.jsx';
import { QueueProgress } from '../../components/QueueProgress.jsx';
import {
  Search,
  RefreshCw,
  AlertCircle,
  Users
} from 'lucide-react';

export const TrackQueuePage = ({ onNavigate }) => {
  const { activeToken, setActiveToken } = useAuth();
  const [searchInput, setSearchInput] = useState(activeToken || 'GEN-020');
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTrackData = async (tokenToFetch) => {
    if (!tokenToFetch) return;
    setIsLoading(true);
    try {
      const details = await queueApi.getTokenDetails(tokenToFetch);
      setTokenDetails(details);
      setErrorMsg(null);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setErrorMsg(`Token "${tokenToFetch}" not found or no active data.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const target = activeToken || 'GEN-020';
    setSearchInput(target);
    fetchTrackData(target);

    // Set up polling timer every 3 seconds for real-time live simulation!
    const interval = setInterval(() => {
      if (target) fetchTrackData(target);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeToken]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveToken(searchInput.trim().toUpperCase());
      fetchTrackData(searchInput.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Real-Time Live Polling Tracker
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Track OPD Queue Token</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-refreshes every 3 seconds from Node.js Express backend.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Token (e.g. GEN-020)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Track Token
          </button>
        </form>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-teal-950 text-teal-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between border border-teal-800/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">Live Backend Connection Active</span>
          <span className="hidden sm:inline text-teal-400">• Updating position & wait time automatically</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
          <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Last sync: {lastSyncTime || 'Just now'}</span>
        </div>
      </div>

      {/* Error Message if search failed */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => onNavigate('/patient/get-token')}
            className="underline font-bold text-rose-900"
          >
            Get a new token
          </button>
        </div>
      )}

      {/* Queue Progress Timeline */}
      {tokenDetails && (
        <div className="space-y-8">
          <QueueProgress status={tokenDetails.status} />

          {/* Main Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <TokenCard details={tokenDetails} onPrint={() => window.print()} />
            </div>

            {/* Live Queue Monitor List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" /> Department Queue Status
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    {tokenDetails.departmentName}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium">
                    {tokenDetails.patientsAhead > 0
                      ? `There are ${tokenDetails.patientsAhead} patient(s) ahead of you in line.`
                      : tokenDetails.status === 'serving'
                      ? 'You are currently in consultation with the doctor!'
                      : 'You are next up in line! Please prepare to enter.'}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Doctor Room</span>
                      <span className="font-bold text-slate-800">{tokenDetails.roomNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Now Serving Token</span>
                      <span className="font-bold font-mono text-emerald-700">{tokenDetails.nowServing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your Token</span>
                      <span className="font-bold font-mono text-teal-800">{tokenDetails.token}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/patient/get-token')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                  >
                    Get Another Token
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
